# SIT-Insight Clinician Dashboard (Frontend Prototype)

This repository contains the source code for the clinician-facing decision support dashboard developed as part of the master's thesis *Revise Mockup for Use Cases*.

- **Live Demo Page:** [https://sit-insight.com](https://sit-insight.com)
- **GitHub Repository:** [https://github.com/[placeholder]](https://github.com/[placeholder]) (Placeholder)

SIT-Insight is a frontend prototype designed to present machine-learning predictions and behavioral modality evidence from the Simulated Interaction Task (SIT). It is built as a single-page application (SPA) running entirely client-side with a simulated backend to decouple user-experience evaluation from GPU-heavy recording analysis dependencies (such as vocal and facial keypoint extraction models).

---

## Technical Stack

- **Core Framework:** React with TypeScript and Vite 6
- **Styling:** Tailwind CSS (utility-based layout configuration) and Radix UI / shadcn/ui primitives
- **Data Visualization:** Recharts (temporal time-series line plots)
- **Localization:** i18next / react-i18next (runtime German and English translations)
- **Icons:** Lucide React

---

## Project Directory Layout

```
.
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Central state controller and layout router
│   │   └── components/             # Reusable UI widgets and specialized sub-views
│   ├── data/
│   │   └── modalityData.ts         # Strongly-typed clinical mock datasets
│   ├── i18n/
│   │   └── index.ts                # Localization dictionary (DE/EN) and configs
│   └── styles/
│       └── index.css               # Global stylesheets and design tokens
├── public/                         # Public static assets (icons, diagnostic schemes)
├── thesis/                         # LaTeX thesis source code and literature database
├── Dockerfile                      # Production build container definition (Nginx runtime)
├── docker-compose.yml              # Local docker-based development orchestration
├── package.json                    # Dependencies and runtime scripts
└── vite.config.ts                  # Vite bundler configurations
```

---

## 1. Local Development (Node.js)

### Prerequisites
- Node.js (v18.x or v22.x recommended)
- npm (v9.x or later)

### Installation
1. Clone the repository and navigate to the project root.
2. Install all dependencies:
   ```bash
   npm install
   ```

### Running the Dev Server
Start the local Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port indicated in your console).

### Code Validation
To check for TypeScript compiler issues and run formatting lint:
```bash
npm run build
```
This command compiles the TypeScript files and reports any syntax or typing issues.

---

## 2. Local Development with Docker Compose

If you prefer running the development environment in a container to avoid installing Node.js locally:

1. Build and start the development server container:
   ```bash
   docker compose up --build
   ```
2. The application will be launched inside Node 22 Alpine, binding your local folder. The interface is exposed at:
   ```
   http://localhost:2346
   ```
3. Any changes made to the files locally will hot-reload automatically inside the container.

---

## 3. How to Use & Access Patient Cases

When the application is run, it displays a secure clinician login portal by default to protect clinical records. Access to specific patient dashboards requires a valid access token.

### 3.1 Initial Setup and Accessing Pre-Configured Cases
Two pre-recorded clinical cases are pre-configured in the repository. To access them, you must first create your local environment configuration:

1. **Create the Environment File**:
   Copy the example environment template file to a live `.env` file:
   ```bash
   cp .env.example .env
   ```
2. **Access Tokens**:
   The local access tokens are defined in your `.env` file:
   - **Patient #52160**: Defined by `VITE_PATIENT_TOKEN_1` (e.g. `example_token_1`)
   - **Patient #67869**: Defined by `VITE_PATIENT_TOKEN_2` (e.g. `example_token_2`)

3. **Logging In**:
   * **Input Box**: Navigate to `http://localhost:5173/` (or port `2346` if running via Docker) and paste the token value into the security access input field.
   * **Direct URL**: Navigate directly using the token in the URL path:
     - `http://localhost:5173/<VITE_PATIENT_TOKEN_1>`
     - `http://localhost:5173/<VITE_PATIENT_TOKEN_2>`

Once logged in, you can switch between the three workflow modes (Screening, In-Depth Assessment, and Learning) using the top navigation header.

---

### 3.2 Configuring Tokens and Adding New Patient Cases

The access routing operates entirely client-side. To change existing tokens or introduce new patient cases into the dashboard, follow this step-by-step procedure:

#### Step 1: Set the Environment Variables
Open your `.env` file at the project root and add or update the keys (e.g., adding a third patient):
```env
# Access token and case directory identifier for the new case
VITE_PATIENT_TOKEN_3=your_new_secure_token_here
VITE_PATIENT_CASE_3=case_new_id
```

#### Step 2: Prepare and Save the Pipeline Data
Generate or place the four pipeline JSON files for the patient in a folder inside `website_data/case_[case_id]/`:
1. `screening_result.json`: High-level overall prediction metrics (risk percentage, confidence).
2. `multilabel_condition_outputs.json`: Predictions for individual diagnostic conditions.
3. `modality_outputs.json`: Gaze, facial, vocal, head movement, and mimicry time-series data.
4. `patient_deviation_tables.json`: Feature-level deviations compared to baseline cohorts.

#### Step 3: Register and Import the Case in React
To load this data statically in the application, register the imports and mapping inside [App.tsx](./src/app/App.tsx):

1. **Import the JSON files**:
   Add the following imports at the top of the file:
   ```typescript
   import screeningResult_new from '../../website_data/case_new_id/screening_result.json';
   import multilabelConditionOutputs_new from '../../website_data/case_new_id/multilabel_condition_outputs.json';
   import modalityOutputs_new from '../../website_data/case_new_id/modality_outputs.json';
   import patientDeviations_new from '../../website_data/case_new_id/patient_deviation_tables.json';
   ```
2. **Define the Case ID reference**:
   Add the Case ID mapping referencing the new environment variable:
   ```typescript
   const caseId3 = import.meta.env.VITE_PATIENT_CASE_3 || 'case_new_id';
   ```
3. **Register the Case Object**:
   Add the case data object inside the `PATIENTS` dictionary:
   ```typescript
   [caseId3]: {
     caseId: caseId3,
     screeningResult: screeningResult_new,
     multilabelConditionOutputs: multilabelConditionOutputs_new,
     modalityOutputs: modalityOutputs_new,
     patientDeviations: patientDeviations_new,
   }
   ```
4. **Register the Access Token**:
   Add the token routing key mapping inside the `PATIENT_TOKENS` dictionary:
   ```typescript
   [import.meta.env.VITE_PATIENT_TOKEN_3 || 'your_fallback_token']: caseId3,
   ```

After saving these changes, the React development bundle or production build will automatically compile the new case assets, making them accessible via your new token.


---

## 4. Production Build & Static Compilation

To generate a production-ready, highly optimized static build bundle:
```bash
npm run build
```
This generates a static directory called `dist/` at the root of the repository containing the compiled HTML, CSS, and JS files.

### Critical SPA Configuration
Because this application uses client-side routing (React Router), the web server serving the `dist/` folder **must** be configured to redirect all non-file queries back to `index.html`. If this is not done, reloading the page on a sub-route (e.g., `/data-modality`) will return a 404 error from the web server.
- **Nginx configuration fallback rule:**
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- **Apache `.htaccess` fallback rule:**
  ```apache
  RewriteEngine On
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /index.html [L]
  ```

---

## 5. Staging Deployments

The prototype is designed to support staging deployments in two environments: an institutional academic server and a private developer homeserver.

### Option A: Institutional Deployment (University Linux Server)

For academic evaluation and supervisor presentation, the frontend is deployed to the university's web space under the registered domain `sit-insight.com` using a multi-container Docker setup consisting of an Nginx reverse proxy and Certbot.

#### 1. University Server `docker-compose.yml`
This compose file runs the Nginx reverse proxy and the Certbot challenge agent on the external network `sit-net`:
```yaml
version: "3.9"

services:
  nginx:
    image: nginx:latest
    container_name: nginx
    networks:
      - sit-net
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./conf.d:/etc/nginx/conf.d
      - ./www:/var/www/certbot
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    container_name: certbot
    networks:
      - sit-net
    volumes:
      - ./www:/var/www/certbot
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt

volumes:
  certbot-etc:
  certbot-var:

networks:
  sit-net:
    external: true
```

#### 2. Reverse Proxy Nginx Configuration (`conf.d/default.conf`)
Configure Nginx to serve the HTTP-01 acme-challenge and proxy secure HTTPS traffic to the frontend dashboard container:
```nginx
# HTTP -> HTTPS Redirect + Challenge Verification
server {
    listen 80;
    listen [::]:80;
    server_name sit-insight.com www.sit-insight.com;

    # Let’s Encrypt acme-challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Secure HTTPS Server Block
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name sit-insight.com www.sit-insight.com;

    ssl_certificate     /etc/letsencrypt/live/sit-insight.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sit-insight.com/privkey.pem;

    # SSL Security Defaults
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy traffic to your frontend container (e.g. dev service on port 2346)
    location / {
        proxy_pass http://dev:2346;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. Issuing the Certificates
To bootstrap the SSL certificate validation (before Nginx can start on port 443 with existing certificate files), you can temporarily comment out the port 443 block, start Nginx on port 80, and run the certbot challenge:
```bash
docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d sit-insight.com -d www.sit-insight.com --email your-email@example.com --agree-tos --no-eff-email
```
After successfully issuing the certificate files in the shared `certbot-etc` volume, uncomment the SSL block and reload Nginx:
```bash
docker compose exec nginx nginx -s reload
```


### Option B: Private Staging Deployment (Homeserver via Cloudflare Tunnel)

To run staging and remote evaluation sessions on a private Linux homeserver without setting up local reverse proxies (like host Nginx) or exposing open incoming ports to the public internet:

1. **Docker Container Construction:**
   Build the production-ready runtime container, which compiles the application and wraps it in a lightweight Nginx Alpine container:
   ```bash
   docker build -t sit-insight-frontend .
   ```
2. **Container Launch:**
   Run the container, mapping its internal HTTP port (80) to a chosen host port (e.g., `8080`):
   ```bash
   docker run -d --name sit-insight-dashboard -p 8080:80 --restart unless-stopped sit-insight-frontend
   ```
3. **Cloudflare Tunnel Routing Setup:**
   Instead of exposing port 8080 publicly or setting up Let's Encrypt certificates manually, route the application through a Cloudflare Tunnel:
   - Install the Cloudflare Tunnel daemon (`cloudflared`) on the homeserver.
   - Login and authenticate your Cloudflare account:
     ```bash
     cloudflared tunnel login
     ```
   - Create a dedicated tunnel:
     ```bash
     cloudflared tunnel create sit-insight-tunnel
     ```
   - Configure public routing. Map your purchased public domain or subdomain (e.g., `dashboard.yourdomain.com`) to route traffic to the local container:
     ```bash
     cloudflared tunnel route dns sit-insight-tunnel dashboard.yourdomain.com
     ```
   - Set up the tunnel configuration (e.g., in `~/.cloudflared/config.yml` or directly via the Cloudflare Zero Trust Dashboard):
     ```yaml
     tunnel: <TUNNEL_UUID>
     credentials-file: /root/.cloudflared/<TUNNEL_UUID>.json

     ingress:
       - hostname: dashboard.yourdomain.com
         service: http://localhost:8080
       - service: http_status:404
     ```
   - Run the tunnel daemon:
     ```bash
     cloudflared tunnel run sit-insight-tunnel
     ```
   Cloudflare will handle TLS/SSL termination at its edge network and forward requests securely to your container via an outbound connection. No ports need to be opened on your router's firewall.