from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TimeEntryViewSet, ProjectViewSet, TimeOffViewSet,
    ClockInView, ClockOutView, DashboardView
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'time-off', TimeOffViewSet, basename='time-off')

urlpatterns = [
    path('', include(router.urls)),
    path('clock-in/', ClockInView.as_view(), name='clock-in'),
    path('clock-out/', ClockOutView.as_view(), name='clock-out'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
