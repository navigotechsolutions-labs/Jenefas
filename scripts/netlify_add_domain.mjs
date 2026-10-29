import fs from 'fs';
import path from 'path';

const configPath = path.join(process.env.APPDATA, 'netlify', 'Config', 'config.json');
const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = Object.values(conf.users)[0].auth.token;
const siteId = '2e453fa9-7bad-4d73-8e5d-79916f7a7538';
const domain = 'jenefas.navigotechsolutions.com';

async function main() {
  console.log('Fetching site details from Netlify API...');
  const getRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!getRes.ok) {
    throw new Error(`Failed to get site: ${getRes.status} ${await getRes.text()}`);
  }

  const site = await getRes.json();
  console.log('Site name:', site.name);
  console.log('Current custom_domain:', site.custom_domain);
  console.log('Current domain_aliases:', site.domain_aliases);

  const aliases = site.domain_aliases || [];
  if (!aliases.includes(domain)) {
    aliases.push(domain);
  }

  console.log('Setting custom_domain to:', domain);
  const patchRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      custom_domain: domain
    })
  });

  if (!patchRes.ok) {
    throw new Error(`Failed to update site: ${patchRes.status} ${await patchRes.text()}`);
  }

  const updated = await patchRes.json();
  console.log('Updated successfully!');
  console.log('Updated domain_aliases:', updated.domain_aliases);
}

main().catch(console.error);
