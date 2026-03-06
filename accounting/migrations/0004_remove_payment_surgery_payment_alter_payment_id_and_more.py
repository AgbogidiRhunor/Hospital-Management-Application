from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0003_surgery_payment'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='part_number',
            field=models.PositiveIntegerField(default=1,
                help_text='Which instalment this is (1 of N)'),
        ),
        migrations.AddField(
            model_name='payment',
            name='total_parts',
            field=models.PositiveIntegerField(default=1,
                help_text='Total number of instalments'),
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_group',
            field=models.CharField(max_length=50, blank=True,
                help_text='Groups related instalments — e.g. surgery-<id>'),
        ),
        migrations.AddField(
            model_name='payment',
            name='discount_amount',
            field=models.DecimalField(max_digits=10, decimal_places=2, default=0),
        ),
        migrations.AddField(
            model_name='payment',
            name='original_amount',
            field=models.DecimalField(max_digits=10, decimal_places=2, default=0,
                help_text='Amount before discount was applied'),
        ),
    ]
