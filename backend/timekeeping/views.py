from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, viewsets, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from .models import TimeEntry, Project, TimeOff
from .serializers import (
    TimeEntrySerializer, ProjectSerializer, TimeOffSerializer,
    ClockInSerializer, ClockOutSerializer, TimeOffReviewSerializer
)

class TimeEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing time entries
    """
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter time entries to only show the current user's entries
        unless the user is a staff member or superuser
        """
        user = self.request.user
        
        # Admin users can see all entries
        if user.is_staff or user.is_superuser:
            return TimeEntry.objects.all()
        
        # Regular users can only see their own entries
        return TimeEntry.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Get the currently active time entry for the current user, if any
        """
        try:
            active_entry = TimeEntry.objects.get(user=request.user, clock_out__isnull=True)
            serializer = self.get_serializer(active_entry)
            return Response(serializer.data)
        except TimeEntry.DoesNotExist:
            return Response({'detail': 'No active time entry found'}, status=status.HTTP_404_NOT_FOUND)

class ClockInView(APIView):
    """
    API endpoint for clocking in
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ClockInSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            time_entry = serializer.save()
            return Response(TimeEntrySerializer(time_entry).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClockOutView(APIView):
    """
    API endpoint for clocking out
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ClockOutSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            active_entry = serializer.validated_data['active_entry']
            time_entry = serializer.update(active_entry, serializer.validated_data)
            return Response(TimeEntrySerializer(time_entry).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing projects
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter projects to only show active ones by default
        """
        queryset = Project.objects.all()
        
        # Filter by active status if requested
        active_only = self.request.query_params.get('active_only', None)
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
            
        return queryset

class TimeOffViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing time off requests
    """
    serializer_class = TimeOffSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter time off requests to only show the current user's requests
        unless the user is a staff member or superuser
        """
        user = self.request.user
        
        # Admin users can see all requests
        if user.is_staff or user.is_superuser:
            return TimeOff.objects.all()
        
        # Regular users can only see their own requests
        return TimeOff.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """
        Review a time off request (approve or reject)
        Only staff members and superusers can review requests
        """
        # Check if user has permission to review
        if not request.user.is_staff and not request.user.is_superuser:
            return Response(
                {'detail': 'You do not have permission to review time off requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        time_off = self.get_object()
        serializer = TimeOffReviewSerializer(
            data=request.data,
            context={'request': request, 'time_off_id': time_off.id}
        )
        
        if serializer.is_valid():
            time_off = serializer.save()
            return Response(TimeOffSerializer(time_off).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    """
    API endpoint to get dashboard data for the current user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get the user's active time entry if any
        try:
            active_entry = TimeEntry.objects.get(user=user, clock_out__isnull=True)
            active_entry_data = TimeEntrySerializer(active_entry).data
        except TimeEntry.DoesNotExist:
            active_entry_data = None
        
        # Get the user's recent time entries
        recent_entries = TimeEntry.objects.filter(user=user).order_by('-clock_in')[:5]
        recent_entries_data = TimeEntrySerializer(recent_entries, many=True).data
        
        # Get the user's pending time off requests
        pending_time_off = TimeOff.objects.filter(user=user, status='pending')
        pending_time_off_data = TimeOffSerializer(pending_time_off, many=True).data
        
        # Get active projects
        active_projects = Project.objects.filter(is_active=True)
        active_projects_data = ProjectSerializer(active_projects, many=True).data
        
        return Response({
            'active_time_entry': active_entry_data,
            'recent_time_entries': recent_entries_data,
            'pending_time_off': pending_time_off_data,
            'active_projects': active_projects_data
        })
