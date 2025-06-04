from rest_framework import serializers
from .models import TimeEntry, Project, TimeOff
from django.utils import timezone

class ProjectSerializer(serializers.ModelSerializer):
    total_time_formatted = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'client', 'is_active', 'total_time_formatted', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TimeEntrySerializer(serializers.ModelSerializer):
    duration_formatted = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    user = serializers.StringRelatedField(read_only=True)
    project_details = ProjectSerializer(source='project', read_only=True)
    
    class Meta:
        model = TimeEntry
        fields = ['id', 'user', 'clock_in', 'clock_out', 'notes', 'project', 'project_details', 
                  'is_active', 'duration_formatted', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ClockInSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = ['project', 'notes']
    
    def create(self, validated_data):
        # Get the current user from the context
        user = self.context['request'].user
        
        # Check if the user already has an active time entry
        active_entries = TimeEntry.objects.filter(user=user, clock_out__isnull=True)
        if active_entries.exists():
            raise serializers.ValidationError("You already have an active time entry. Please clock out first.")
        
        # Create a new time entry
        time_entry = TimeEntry.objects.create(
            user=user,
            clock_in=timezone.now(),
            **validated_data
        )
        
        return time_entry

class ClockOutSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        user = self.context['request'].user
        
        # Find the active time entry for the user
        try:
            active_entry = TimeEntry.objects.get(user=user, clock_out__isnull=True)
        except TimeEntry.DoesNotExist:
            raise serializers.ValidationError("You don't have an active time entry to clock out from.")
            
        # Add the active entry to the validated data
        attrs['active_entry'] = active_entry
        return attrs
    
    def update(self, instance, validated_data):
        # Update the clock out time and notes if provided
        instance.clock_out = timezone.now()
        
        if 'notes' in validated_data:
            if instance.notes:
                instance.notes += f"\n\nClock out notes: {validated_data['notes']}"
            else:
                instance.notes = validated_data['notes']
                
        instance.save()
        return instance

class TimeOffSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=TimeOff.STATUS_CHOICES, read_only=True)
    reviewed_by = serializers.StringRelatedField(read_only=True)
    days_requested = serializers.ReadOnlyField()
    
    class Meta:
        model = TimeOff
        fields = ['id', 'start_date', 'end_date', 'request_type', 'status', 'reason',
                  'reviewed_by', 'reviewed_at', 'review_notes', 'days_requested', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'reviewed_by', 'reviewed_at', 'review_notes', 
                           'created_at', 'updated_at']
    
    def validate(self, attrs):
        # Validate start_date is before end_date
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError({'end_date': 'End date must be after start date'})
        
        # Validate start_date is not in the past
        if attrs['start_date'] < timezone.now().date():
            raise serializers.ValidationError({'start_date': 'Start date cannot be in the past'})
            
        return attrs
    
    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TimeOffReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])
    review_notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        time_off_id = self.context.get('time_off_id')
        if not time_off_id:
            raise serializers.ValidationError("Time off request ID is required")
            
        try:
            time_off = TimeOff.objects.get(id=time_off_id)
        except TimeOff.DoesNotExist:
            raise serializers.ValidationError("Time off request not found")
            
        if time_off.status != 'pending':
            raise serializers.ValidationError(f"Time off request has already been {time_off.status}")
            
        attrs['time_off'] = time_off
        return attrs
    
    def save(self):
        time_off = self.validated_data['time_off']
        status = self.validated_data['status']
        review_notes = self.validated_data.get('review_notes', '')
        reviewer = self.context['request'].user
        
        if status == 'approved':
            time_off.approve(reviewer)
        else:
            time_off.reject(reviewer, review_notes)
            
        return time_off
