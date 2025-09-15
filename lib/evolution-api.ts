export interface EvolutionInstance {
  id: string
  name: string
  base_url: string
  api_key: string
  status: "active" | "inactive" | "maintenance"
  max_numbers: number
  current_numbers: number
}

export class EvolutionAPIClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
    this.apiKey = apiKey
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: this.apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Evolution API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Criar instância do WhatsApp
  async createInstance(instanceName: string) {
    return this.request("/instance/create", {
      method: "POST",
      body: JSON.stringify({
        instanceName,
        token: this.apiKey,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS",
      }),
    })
  }

  // Conectar instância
  async connectInstance(instanceName: string) {
    return this.request(`/instance/connect/${instanceName}`, {
      method: "GET",
    })
  }

  // Obter QR Code
  async getQRCode(instanceName: string) {
    return this.request(`/instance/qrcode/${instanceName}`, {
      method: "GET",
    })
  }

  // Enviar mensagem
  async sendMessage(instanceName: string, number: string, message: string) {
    return this.request(`/message/sendText/${instanceName}`, {
      method: "POST",
      body: JSON.stringify({
        number: number,
        text: message,
      }),
    })
  }

  // Verificar status da instância
  async getInstanceStatus(instanceName: string) {
    return this.request(`/instance/fetchInstances/${instanceName}`, {
      method: "GET",
    })
  }

  // Listar todas as instâncias
  async listInstances() {
    return this.request("/instance/fetchInstances", {
      method: "GET",
    })
  }
}

// Função helper para criar cliente Evolution API
export function createEvolutionClient(instance: EvolutionInstance) {
  return new EvolutionAPIClient(instance.base_url, instance.api_key)
}
