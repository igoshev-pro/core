Запуск

docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
docker compose -f docker-compose.dev.yml logs -f api

Открывать

Web: http://localhost:3000
API: http://localhost:3001

Остановить

docker compose -f docker-compose.dev.yml down

Снести базу

docker compose -f docker-compose.dev.yml down -v

pnpm run start:dev

на сервере перезапуск

docker compose --env-file .env up -d --force-recreate

{
	"name": "Дмитрий",
	"email": "dimitri@igoshev.de",
	"role": "superAdmin",
	"status": "active",
	"balance": [
		0
	],
	"currentCurrency": "RUB",
	"_id": "694490c526ead88fa46ae443",
	"createdAt": "2025-12-18T23:39:49.940Z",
	"updatedAt": "2025-12-18T23:39:49.940Z",
	"__v": 0
}

{
	"slug": "igoshev-pro",
	"name": "Igoshev PRO",
	"url": "https://igoshev.pro",
	"description": "SAAS",
	"domains": [
		"localhost",
		"igoshev.pro"
	],
	"primaryDomain": "igoshev.pro",
	"type": "core",
	"status": "active",
	"owner": "694490c526ead88fa46ae443",
	"features": {
		"topLevel": [],
		"cmsFeatures": [],
		"entityFeatures": [],
		"modulesFeatures": []
	},
	"db": {
		"mongo": {
			"uri": "mongodb://root:root@localhost:27017/app?authSource=admin",
			"core": ""
		}
	},
	"templateId": "landing-default",
	"themeId": "default",
	"seo": {
		"defaultTitle": "",
		"defaultDescription": "",
		"_id": "694492f326ead88fa46ae445"
	},
	"siteSettings": {
		"template": {
			"name": "Default"
		},
		"theme": {
			"primaryColor": "#000000",
			"secondaryColor": "#ffffff",
			"accentColor": "#ff0000"
		},
		"fonts": {
			"primary": "Roboto",
			"secondary": "Arial"
		},
		"_id": "694492f326ead88fa46ae446"
	},
	"pages": [],
	"isDemo": false,
	"isArchived": false,
	"_id": "694492f326ead88fa46ae447",
	"entities": [],
	"createdAt": "2025-12-18T23:49:07.094Z",
	"updatedAt": "2025-12-18T23:49:07.094Z",
	"__v": 0
}

прод

{
	"name": "Дмитрий",
	"email": "dimitri@igoshev.de",
	"role": "superAdmin",
	"status": "active",
	"balance": [
		0
	],
	"currentCurrency": "RUB",
	"_id": "694494546cb50d540522d2c0",
	"createdAt": "2025-12-18T23:55:00.432Z",
	"updatedAt": "2025-12-18T23:55:00.432Z",
	"__v": 0
}

{
	"slug": "igoshev-pro",
	"name": "Igoshev PRO",
	"url": "https://igoshev.pro",
	"description": "SAAS",
	"domains": [
		"localhost",
		"igoshev.pro"
	],
	"primaryDomain": "igoshev.pro",
	"type": "core",
	"status": "active",
	"owner": "694494546cb50d540522d2c0",
	"features": {
		"topLevel": [],
		"cmsFeatures": [],
		"entityFeatures": [],
		"modulesFeatures": []
	},
	"db": {
		"mongo": {
			"uri": "mongodb://root:root@localhost:27017/app?authSource=admin",
			"core": ""
		}
	},
	"templateId": "landing-default",
	"themeId": "default",
	"seo": {
		"defaultTitle": "",
		"defaultDescription": "",
		"_id": "6944948c6cb50d540522d2c2"
	},
	"siteSettings": {
		"template": {
			"name": "Default"
		},
		"theme": {
			"primaryColor": "#000000",
			"secondaryColor": "#ffffff",
			"accentColor": "#ff0000"
		},
		"fonts": {
			"primary": "Roboto",
			"secondary": "Arial"
		},
		"_id": "6944948c6cb50d540522d2c3"
	},
	"pages": [],
	"isDemo": false,
	"isArchived": false,
	"_id": "6944948c6cb50d540522d2c4",
	"entities": [],
	"createdAt": "2025-12-18T23:55:56.787Z",
	"updatedAt": "2025-12-18T23:55:56.787Z",
	"__v": 0
}