# ai.isaure-lohest.com

## VPS layout

```text
/var/www/html/isaure/
├── vue-portfolio/                       # site principal existant, inchangé
└── sites/
    └── ai.isaure-lohest.com/
        ├── current -> releases/20260409-120000
        ├── previous -> releases/20260408-235959
        ├── releases/
        │   ├── 20260408-235959/
        │   └── 20260409-120000/
        └── shared/
```

## Apache files

- `/etc/apache2/sites-available/ai.isaure-lohest.com.conf`
- `/etc/apache2/sites-available/ai.isaure-lohest.com-le-ssl.conf`

## Local commands

```bash
chmod +x scripts/deploy-ai-subdomain.sh scripts/rollback-ai-subdomain.sh
./scripts/deploy-ai-subdomain.sh
./scripts/rollback-ai-subdomain.sh
```
