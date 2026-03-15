/**
 * Integração CRM — HubSpot ou Pipedrive.
 *
 * Configuração via .env:
 *   CRM_PROVIDER=hubspot|pipedrive
 *   HUBSPOT_API_KEY=pat-xxx
 *   PIPEDRIVE_API_TOKEN=xxx
 *   PIPEDRIVE_DOMAIN=company (para company.pipedrive.com)
 */

const CRM_PROVIDER = process.env.CRM_PROVIDER as "hubspot" | "pipedrive" | undefined;

/* ─── Types ─── */

interface CrmContact {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cidade?: string;
  pais?: string;
}

interface CrmDeal {
  nome: string;
  email: string;
  valor?: number;
  titulo: string;
  etapa?: string;
  notas?: string;
}

/* ─── HubSpot ─── */

async function hubspotRequest(endpoint: string, method: string, body?: object) {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`https://api.hubapi.com${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    console.error(`HubSpot ${method} ${endpoint} failed:`, res.status, await res.text());
    return null;
  }

  return res.json();
}

async function hubspotCreateContact(data: CrmContact) {
  return hubspotRequest("/crm/v3/objects/contacts", "POST", {
    properties: {
      firstname: data.nome.split(" ")[0],
      lastname: data.nome.split(" ").slice(1).join(" ") || "",
      email: data.email,
      phone: data.telefone || "",
      company: data.empresa || "",
      city: data.cidade || "",
      country: data.pais || "",
      hs_lead_status: "NEW",
    },
  });
}

async function hubspotCreateDeal(data: CrmDeal) {
  // Primeiro buscar ou criar contato
  const contact = await hubspotRequest(
    `/crm/v3/objects/contacts/${encodeURIComponent(data.email)}?idProperty=email`,
    "GET"
  );

  const deal = await hubspotRequest("/crm/v3/objects/deals", "POST", {
    properties: {
      dealname: data.titulo,
      amount: data.valor?.toString() || "",
      dealstage: data.etapa || "qualifiedtobuy",
      description: data.notas || "",
      pipeline: "default",
    },
  });

  // Associar deal ao contato
  if (deal?.id && contact?.id) {
    await hubspotRequest(
      `/crm/v3/objects/deals/${deal.id}/associations/contacts/${contact.id}/deal_to_contact`,
      "PUT"
    );
  }

  return deal;
}

/* ─── Pipedrive ─── */

function pipedriveUrl(endpoint: string) {
  const domain = process.env.PIPEDRIVE_DOMAIN || "api";
  const token = process.env.PIPEDRIVE_API_TOKEN;
  return `https://${domain}.pipedrive.com/api/v1${endpoint}?api_token=${token}`;
}

async function pipedriveRequest(endpoint: string, method: string, body?: object) {
  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token) return null;

  const res = await fetch(pipedriveUrl(endpoint), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    console.error(`Pipedrive ${method} ${endpoint} failed:`, res.status, await res.text());
    return null;
  }

  const json = await res.json();
  return json.data;
}

async function pipedriveCreateContact(data: CrmContact) {
  // Criar pessoa
  const person = await pipedriveRequest("/persons", "POST", {
    name: data.nome,
    email: [{ value: data.email, primary: true }],
    phone: data.telefone ? [{ value: data.telefone, primary: true }] : [],
  });

  // Criar organização se houver empresa
  if (data.empresa && person?.id) {
    const org = await pipedriveRequest("/organizations", "POST", {
      name: data.empresa,
    });
    if (org?.id) {
      await pipedriveRequest(`/persons/${person.id}`, "PUT", {
        org_id: org.id,
      });
    }
  }

  return person;
}

async function pipedriveCreateDeal(data: CrmDeal) {
  // Buscar ou criar pessoa
  const searchRes = await pipedriveRequest(
    `/persons/search?term=${encodeURIComponent(data.email)}&limit=1`,
    "GET"
  );
  let personId = searchRes?.items?.[0]?.item?.id;

  if (!personId) {
    const person = await pipedriveRequest("/persons", "POST", {
      name: data.nome,
      email: [{ value: data.email, primary: true }],
    });
    personId = person?.id;
  }

  return pipedriveRequest("/deals", "POST", {
    title: data.titulo,
    value: data.valor || 0,
    currency: "EUR",
    person_id: personId,
    status: "open",
  });
}

/* ─── Public API ─── */

export async function crmSyncContact(data: CrmContact): Promise<void> {
  if (!CRM_PROVIDER) return;

  try {
    if (CRM_PROVIDER === "hubspot") {
      await hubspotCreateContact(data);
    } else if (CRM_PROVIDER === "pipedrive") {
      await pipedriveCreateContact(data);
    }
  } catch (err) {
    console.error("CRM contact sync failed:", err);
  }
}

export async function crmSyncDeal(data: CrmDeal): Promise<void> {
  if (!CRM_PROVIDER) return;

  try {
    if (CRM_PROVIDER === "hubspot") {
      await hubspotCreateDeal(data);
    } else if (CRM_PROVIDER === "pipedrive") {
      await pipedriveCreateDeal(data);
    }
  } catch (err) {
    console.error("CRM deal sync failed:", err);
  }
}

export function isCrmConfigured(): boolean {
  if (CRM_PROVIDER === "hubspot") return !!process.env.HUBSPOT_API_KEY;
  if (CRM_PROVIDER === "pipedrive") return !!process.env.PIPEDRIVE_API_TOKEN;
  return false;
}
