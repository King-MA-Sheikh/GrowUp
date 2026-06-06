import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import TeamMember

class Command(BaseCommand):
    help = 'Import team members from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to JSON file')
        parser.add_argument('--force-update', action='store_true', help='Force update existing team members')

    def handle(self, *args, **options):
        file_path = options['json_file']
        force_update = options['force_update']
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                team_data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Invalid JSON: {e}'))
            return
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for data in team_data:
            # Create slug from name
            slug = slugify(data['name'])[:100]
            
            # Check if team member already exists
            existing = TeamMember.objects.filter(slug=slug).first()
            
            # Parse languages (ensure proper format)
            languages = data.get('languages', [])
            if isinstance(languages, list) and languages and isinstance(languages[0], str):
                # Convert string list to proper format
                languages = [{'name': lang, 'proficiency': 'Fluent'} for lang in languages]
            
            team_data_dict = {
                'name': data['name'],
                'role': data.get('role', 'backend_dev'),
                'bio': data.get('bio', ''),
                'short_bio': data.get('short_bio', ''),
                'experience_years': data.get('experience_years', 0),
                'projects_completed': data.get('projects_completed', 0),
                'rating': data.get('rating', 5.0),
                'skills': data.get('skills', []),
                'certifications': data.get('certifications', []),
                'languages': languages,
                'github_url': data.get('github_url', ''),
                'linkedin_url': data.get('linkedin_url', ''),
                'twitter_url': data.get('twitter_url', ''),
                'portfolio_url': data.get('portfolio_url', ''),
                'is_available': data.get('is_available', True),
                'is_featured': data.get('is_featured', False),
                'is_active': data.get('is_active', True),
                'order': data.get('order', 0),
            }
            
            if existing:
                if force_update:
                    for key, value in team_data_dict.items():
                        setattr(existing, key, value)
                    existing.save()
                    updated_count += 1
                    self.stdout.write(self.style.WARNING(f'Updated: {data["name"]}'))
                else:
                    skipped_count += 1
                    self.stdout.write(self.style.WARNING(f'Skipped (already exists): {data["name"]}'))
            else:
                # Create new team member
                TeamMember.objects.create(slug=slug, **team_data_dict)
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {data["name"]}'))
        
        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Import Complete!\n'
            f'   Created: {created_count} team members\n'
            f'   Updated: {updated_count} team members\n'
            f'   Skipped: {skipped_count} team members\n'
            f'   Total: {created_count + updated_count + skipped_count} team members'
        ))
        
        # Show summary
        self.stdout.write(self.style.SUCCESS(
            f'\n📊 Database Summary:\n'
            f'   Total team members: {TeamMember.objects.count()}\n'
            f'   Available: {TeamMember.objects.filter(is_available=True).count()}\n'
            f'   Featured: {TeamMember.objects.filter(is_featured=True).count()}'
        ))