from django.contrib import admin
from .models import TimeEntry, Project, TimeOff

class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ['user', 'clock_in', 'clock_out', 'is_active', 'duration_formatted', 'project']
    list_filter = ['user', 'clock_in', 'project']
    search_fields = ['user__username', 'user__email', 'notes']
    date_hierarchy = 'clock_in'

class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'is_active', 'total_time_formatted']
    list_filter = ['is_active', 'client']
    search_fields = ['name', 'description', 'client']

class TimeOffAdmin(admin.ModelAdmin):
    list_display = ['user', 'start_date', 'end_date', 'request_type', 'status', 'days_requested']
    list_filter = ['status', 'request_type', 'start_date']
    search_fields = ['user__username', 'user__email', 'reason']
    date_hierarchy = 'start_date'
    
    actions = ['approve_requests', 'reject_requests']
    
    def approve_requests(self, request, queryset):
        for time_off in queryset:
            time_off.approve(request.user)
        self.message_user(request, f"{queryset.count()} time off request(s) were approved.")
    approve_requests.short_description = "Approve selected time off requests"
    
    def reject_requests(self, request, queryset):
        for time_off in queryset:
            time_off.reject(request.user, "Rejected via admin action")
        self.message_user(request, f"{queryset.count()} time off request(s) were rejected.")
    reject_requests.short_description = "Reject selected time off requests"

admin.site.register(TimeEntry, TimeEntryAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(TimeOff, TimeOffAdmin)
