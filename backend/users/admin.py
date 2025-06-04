from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, Organization

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'user_count', 'max_users', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['user_count', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'first_name', 'last_name', 'organization', 'role', 'is_staff']
    list_filter = ['organization', 'role', 'is_staff', 'is_invited']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    fieldsets = UserAdmin.fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role')}),
        ('Additional Info', {'fields': ('job_title', 'department', 'phone_number')}),
        ('Invitation Info', {'fields': ('is_invited', 'invitation_token', 'invited_by', 'invited_at')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Organization Info', {'fields': ('organization', 'role')}),
        ('Additional Info', {'fields': ('email', 'job_title', 'department', 'phone_number')}),
    )
    readonly_fields = ['invitation_token', 'invited_at']

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'date_of_birth', 'hire_date']
    search_fields = ['user__email', 'user__username']

admin.site.register(Organization, OrganizationAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
