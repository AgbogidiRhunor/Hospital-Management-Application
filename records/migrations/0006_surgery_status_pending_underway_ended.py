from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0005_alter_doctornote_options_alter_doctornote_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='surgery',
            name='status',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('draft', 'Draft — Awaiting Patient Review'),
                    ('patient_reviewed', 'Patient Reviewed — Awaiting Payment'),
                    ('pending', 'Pending — Awaiting Surgery'),
                    ('underway', 'Underway'),
                    ('ended', 'Ended'),
                    ('paid', 'Paid — Scheduled'),
                    ('scheduled', 'Scheduled'),
                    ('completed', 'Completed'),
                    ('cancelled', 'Cancelled'),
                ],
                default='draft',
            ),
        ),
    ]
