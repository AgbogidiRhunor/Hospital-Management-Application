from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0003_surgery_patient_workflow'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurgeryDrug',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('drug_name', models.CharField(max_length=200)),
                ('dosage', models.CharField(blank=True, max_length=200)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price_at_time', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('surgery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='surgery_drugs', to='records.surgery')),
                ('drug', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pharmacy.drug')),
            ],
        ),
        migrations.CreateModel(
            name='SurgeryLabTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_name', models.CharField(max_length=200)),
                ('price_at_time', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('surgery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='surgery_labs', to='records.surgery')),
                ('test', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='lab.labtest')),
            ],
        ),
        migrations.AddField(
            model_name='wardadmission',
            name='discount_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
