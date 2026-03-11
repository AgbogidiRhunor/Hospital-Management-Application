from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'patient', 'payment_type', 'amount', 'is_paid',
        'payment_group', 'part_number', 'total_parts',
        'accountant', 'created_at',
    ]
    list_filter = ['payment_type', 'is_paid', 'created_at']
    search_fields = ['patient__username', 'patient__first_name', 'payment_group']
    raw_id_fields = ['visit', 'patient', 'accountant', 'lab_request', 'prescription', 'admission', 'surgery']
    ordering = ['-created_at']