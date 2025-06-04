from django.db import models
from django.conf import settings
from django.utils import timezone

class TimeEntry(models.Model):
    """Model for tracking time entries"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_entries')
    clock_in = models.DateTimeField()
    clock_out = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    # Optional project/task tracking
    project = models.ForeignKey('Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='time_entries')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-clock_in']
        
    def __str__(self):
        return f"{self.user.username} - {self.clock_in.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def is_active(self):
        return self.clock_out is None
    
    @property
    def duration(self):
        """Calculate the duration of the time entry in seconds"""
        if not self.clock_out:
            return None
        
        duration = self.clock_out - self.clock_in
        return duration.total_seconds()
    
    @property
    def duration_formatted(self):
        """Format the duration as HH:MM:SS"""
        seconds = self.duration
        if seconds is None:
            return "In progress"
        
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"

class Project(models.Model):
    """Model for tracking projects"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    client = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def total_time(self):
        """Calculate the total time spent on the project in seconds"""
        total_seconds = 0
        for entry in self.time_entries.all():
            if entry.duration:
                total_seconds += entry.duration
        return total_seconds
    
    @property
    def total_time_formatted(self):
        """Format the total time as HH:MM:SS"""
        seconds = self.total_time
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"

class TimeOff(models.Model):
    """Model for tracking time off requests"""
    TYPE_CHOICES = (
        ('vacation', 'Vacation'),
        ('sick', 'Sick Leave'),
        ('personal', 'Personal Leave'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_off_requests')
    start_date = models.DateField()
    end_date = models.DateField()
    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)
    
    # For approvals/rejections
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviewed_time_off_requests'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.start_date} to {self.end_date} ({self.get_request_type_display()})"
    
    def approve(self, reviewer):
        """Approve the time off request"""
        self.status = 'approved'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        self.save()
    
    def reject(self, reviewer, notes=''):
        """Reject the time off request"""
        self.status = 'rejected'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        self.review_notes = notes
        self.save()
        
    @property
    def days_requested(self):
        """Calculate the number of days requested"""
        delta = self.end_date - self.start_date
        return delta.days + 1  # Include the end date
