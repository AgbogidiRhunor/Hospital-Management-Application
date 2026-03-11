from django.contrib import admin
from .models import PatientVisit, WardAdmission, Surgery, VitalSigns, DoctorNote


@admin.register(PatientVisit)
class PatientVisitAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'status', 'queue_number', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['patient__username', 'patient__first_name']


@admin.register(WardAdmission)
class WardAdmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'ward', 'bed_number', 'status', 'total_admission_fee', 'created_at']
    list_filter = ['status', 'ward']
    search_fields = ['patient__username', 'patient__first_name']


@admin.register(Surgery)
class SurgeryAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'procedure_name', 'status', 'surgery_fee', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['patient__username', 'procedure_name']


admin.site.register(VitalSigns)
admin.site.register(DoctorNote)