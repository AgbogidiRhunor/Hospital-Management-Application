from django.contrib import admin
from .models import PatientVisit, Ward, WardAdmission, Surgery, VitalSigns, DoctorNote


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


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'ward_code',
        'capacity',
        'occupied_beds_display',
        'available_beds_display'
    ]

    search_fields = ['name', 'ward_code']
    list_editable = ['capacity']

    def occupied_beds_display(self, obj):
        return obj.wardadmission_set.filter(status='admitted').count()
    occupied_beds_display.short_description = 'Occupied Beds'

    def available_beds_display(self, obj):
        return obj.capacity - self.occupied_beds_display(obj)
    available_beds_display.short_description = 'Available Beds'


@admin.register(Surgery)
class SurgeryAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'procedure_name', 'status', 'surgery_fee', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['patient__username', 'procedure_name']


admin.site.register(VitalSigns)
admin.site.register(DoctorNote)