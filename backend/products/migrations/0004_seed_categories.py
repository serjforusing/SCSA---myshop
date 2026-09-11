from django.db import migrations


def add_categories(apps, schema_editor):
    Category = apps.get_model("products", "Category")
    for name in ["ელექტრონიკა", "ტანსაცმელი", "სახლი და ბაღი", "წიგნები", "სხვა"]:
        Category.objects.get_or_create(name=name)


class Migration(migrations.Migration):
    dependencies = [("products", "0003_cart_order_orderitem_cartitem")]
    operations = [migrations.RunPython(add_categories, migrations.RunPython.noop)]
