import type { SupabaseClient, Session, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";
import { goto } from "$app/navigation";
import type { Database } from "$lib/types/database.types";

interface UserStateProps {
  session: Session | null;
  supabase: SupabaseClient | null;
  user: User | null;
}

export interface Cliente {
  id_cliente: number;
  created_at: string;
  cod_fisc: string;
  nome: string | null;
  cognome: string | null;
  telefono: string | null;
  email: string | null;
  tesserato: boolean | null;
  data_tess: string | null;
  d_scad_tess: string | null;
  user_id: string | null;
}

export interface Pratica {
  id_pratica: number;
  cod_pratica: string;
  tipo_pratica: string | null;
  punteggio: number | null;
  nome_pratica: string | null;
  user_id: string | null;
}

export interface ListaPratiche {
  id: number;
  created_at: string;
  data: string | null;
  note: string | null;
  id_cliente: number | null;
  id_pratica: number | null;
  user_id: string | null;
  esito: string | null;
}

// Interface per dati combinati utili per la visualizzazione
export interface PraticaCompleta extends ListaPratiche {
  cliente_nome?: string;
  cliente_cognome?: string;
  cliente_cod_fisc?: string;
  pratica_nome?: string;
  pratica_tipo?: string;
  pratica_codice?: string;
}

export interface ClienteConPratiche extends Cliente {
  pratiche_count?: number;
  ultima_pratica?: string;
}

type UpdatableClienteFields = Omit<Cliente, "id_cliente" | "user_id" | "created_at">;
type UpdatablePraticaFields = Omit<Pratica, "id_pratica" | "user_id">;
type UpdatableListaPraticheFields = Omit<ListaPratiche, "id" | "user_id" | "created_at">;

export class UserState {
  session = $state<Session | null>(null);
  supabase = $state<SupabaseClient<Database> | null>(null);
  user = $state<User | null>(null);
  userName = $state<string | null>(null);
  
  // Dati CRM
  clienti = $state<Cliente[]>([]);
  pratiche = $state<Pratica[]>([]);
  listaPratiche = $state<ListaPratiche[]>([]);
  
  // Dati combinati per performance
  praticheComplete = $state<PraticaCompleta[]>([]);
  clientiConPratiche = $state<ClienteConPratiche[]>([]);

  constructor(data: UserStateProps) {
    this.updateState(data);
  }

  updateState(data: UserStateProps) {
    this.session = data.session;
    this.supabase = data.supabase;
    this.user = data.user;
    this.fetchUserData();
  }

  async fetchUserData() {
    if (!this.user || !this.supabase) {
      return;
    }

    try {
      const [clientiResponse, praticheResponse, listaPraticheResponse, userNamesResponse] = await Promise.all([
        this.supabase.from("Clienti").select("*").eq("user_id", this.user.id),
        this.supabase.from("Pratiche").select("*").eq("user_id", this.user.id),
        this.supabase.from("Lista_Pratiche").select("*").eq("user_id", this.user.id),
        this.supabase.from("user_names").select("name").eq("user_id", this.user.id).single(),
      ]);

      if (clientiResponse.error || praticheResponse.error || listaPraticheResponse.error || userNamesResponse.error) {
        console.log("Errore nel recupero dati utente", {
          clientiError: clientiResponse.error,
          praticheError: praticheResponse.error,
          listaPraticheError: listaPraticheResponse.error,
          userNamesError: userNamesResponse.error,
        });
        return;
      }

      this.clienti = clientiResponse.data || [];
      this.pratiche = praticheResponse.data || [];
      this.listaPratiche = listaPraticheResponse.data || [];
      this.userName = userNamesResponse.data?.name || null;
      
      // Aggiorna i dati combinati
      this.updateCombinedData();
    } catch (error) {
      console.error("Errore nel fetch dei dati:", error);
    }
  }

  // Aggiorna i dati combinati per ottimizzare le query
  private updateCombinedData() {
    // Crea pratiche complete con info cliente e pratica
    this.praticheComplete = this.listaPratiche.map(lp => {
      const cliente = this.clienti.find(c => c.id_cliente === lp.id_cliente);
      const pratica = this.pratiche.find(p => p.id_pratica === lp.id_pratica);
      
      return {
        ...lp,
        cliente_nome: cliente?.nome,
        cliente_cognome: cliente?.cognome,
        cliente_cod_fisc: cliente?.cod_fisc,
        pratica_nome: pratica?.nome_pratica,
        pratica_tipo: pratica?.tipo_pratica,
        pratica_codice: pratica?.cod_pratica,
      };
    });

    // Crea clienti con info sulle pratiche
    this.clientiConPratiche = this.clienti.map(cliente => {
      const praticheCliente = this.listaPratiche.filter(lp => lp.id_cliente === cliente.id_cliente);
      const ultimaPratica = praticheCliente
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      return {
        ...cliente,
        pratiche_count: praticheCliente.length,
        ultima_pratica: ultimaPratica?.data || null,
      };
    });
  }

  // CRUD Clienti
  async addCliente(clienteData: Omit<UpdatableClienteFields, "user_id">) {
    if (!this.supabase || !this.user) return;

    const { data, error } = await this.supabase
      .from("Clienti")
      .insert({ ...clienteData, user_id: this.user.id })
      .select()
      .single();

    if (!error && data) {
      this.clienti = [...this.clienti, data];
      this.updateCombinedData();
    }
    return { data, error };
  }

  async updateCliente(clienteId: number, updateData: Partial<UpdatableClienteFields>) {
    if (!this.supabase) return;

    const { data, error } = await this.supabase
      .from("Clienti")
      .update(updateData)
      .eq("id_cliente", clienteId)
      .select()
      .single();

    if (!error && data) {
      this.clienti = this.clienti.map(c => c.id_cliente === clienteId ? data : c);
      this.updateCombinedData();
    }
    return { data, error };
  }

  async deleteCliente(clienteId: number) {
    if (!this.supabase) return;

    const { error } = await this.supabase
      .from("Clienti")
      .delete()
      .eq("id_cliente", clienteId);

    if (!error) {
      this.clienti = this.clienti.filter(c => c.id_cliente !== clienteId);
      // Rimuovi anche le pratiche associate
      this.listaPratiche = this.listaPratiche.filter(lp => lp.id_cliente !== clienteId);
      this.updateCombinedData();
    }
    return { error };
  }

  // CRUD Pratiche
  async addPratica(praticaData: Omit<UpdatablePraticaFields, "user_id">) {
    if (!this.supabase || !this.user) return;

    const { data, error } = await this.supabase
      .from("Pratiche")
      .insert({ ...praticaData, user_id: this.user.id })
      .select()
      .single();

    if (!error && data) {
      this.pratiche = [...this.pratiche, data];
      this.updateCombinedData();
    }
    return { data, error };
  }

  async updatePratica(praticaId: number, updateData: Partial<UpdatablePraticaFields>) {
    if (!this.supabase) return;

    const { data, error } = await this.supabase
      .from("Pratiche")
      .update(updateData)
      .eq("id_pratica", praticaId)
      .select()
      .single();

    if (!error && data) {
      this.pratiche = this.pratiche.map(p => p.id_pratica === praticaId ? data : p);
      this.updateCombinedData();
    }
    return { data, error };
  }

  async deletePratica(praticaId: number) {
    if (!this.supabase) return;

    const { error } = await this.supabase
      .from("Pratiche")
      .delete()
      .eq("id_pratica", praticaId);

    if (!error) {
      this.pratiche = this.pratiche.filter(p => p.id_pratica !== praticaId);
      // Rimuovi anche dalla lista pratiche
      this.listaPratiche = this.listaPratiche.filter(lp => lp.id_pratica !== praticaId);
      this.updateCombinedData();
    }
    return { error };
  }

  // CRUD Lista Pratiche (associazioni cliente-pratica)
  async addPraticaACliente(listaPraticheData: Omit<UpdatableListaPraticheFields, "user_id">) {
    if (!this.supabase || !this.user) return;

    const { data, error } = await this.supabase
      .from("Lista_Pratiche")
      .insert({ ...listaPraticheData, user_id: this.user.id })
      .select()
      .single();

    if (!error && data) {
      this.listaPratiche = [...this.listaPratiche, data];
      this.updateCombinedData();
    }
    return { data, error };
  }

  async updatePraticaCliente(praticaClienteId: number, updateData: Partial<UpdatableListaPraticheFields>) {
    if (!this.supabase) return;

    const { data, error } = await this.supabase
      .from("Lista_Pratiche")
      .update(updateData)
      .eq("id", praticaClienteId)
      .select()
      .single();

    if (!error && data) {
      this.listaPratiche = this.listaPratiche.map(lp => lp.id === praticaClienteId ? data : lp);
      this.updateCombinedData();
    }
    return { data, error };
  }

  async deletePraticaCliente(praticaClienteId: number) {
    if (!this.supabase) return;

    const { error } = await this.supabase
      .from("Lista_Pratiche")
      .delete()
      .eq("id", praticaClienteId);

    if (!error) {
      this.listaPratiche = this.listaPratiche.filter(lp => lp.id !== praticaClienteId);
      this.updateCombinedData();
    }
    return { error };
  }

  // Metodi di utilità per analisi e filtri
  getClienteById(clienteId: number) {
    return this.clienti.find(c => c.id_cliente === clienteId);
  }

  getPraticaById(praticaId: number) {
    return this.pratiche.find(p => p.id_pratica === praticaId);
  }

  getPraticheByCliente(clienteId: number) {
    return this.praticheComplete.filter(pc => pc.id_cliente === clienteId);
  }

  getClientiByPratica(praticaId: number) {
    return this.praticheComplete.filter(pc => pc.id_pratica === praticaId);
  }

  // Statistiche
  getTotalClienti() {
    return this.clienti.length;
  }

  getTotalPratiche() {
    return this.pratiche.length;
  }

  getTotalPraticheAssegnate() {
    return this.listaPratiche.length;
  }

  getClientiTesserati() {
    return this.clienti.filter(c => c.tesserato === true);
  }

  getPraticheByTipo(tipo: string) {
    return this.pratiche.filter(p => p.tipo_pratica === tipo);
  }

  getPraticheByEsito(esito: string) {
    return this.praticheComplete.filter(pc => pc.esito === esito);
  }

  // Ricerca
  searchClienti(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.clienti.filter(c => 
      c.nome?.toLowerCase().includes(lowerQuery) ||
      c.cognome?.toLowerCase().includes(lowerQuery) ||
      c.cod_fisc?.toLowerCase().includes(lowerQuery) ||
      c.email?.toLowerCase().includes(lowerQuery)
    );
  }

  searchPratiche(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.pratiche.filter(p =>
      p.nome_pratica?.toLowerCase().includes(lowerQuery) ||
      p.cod_pratica?.toLowerCase().includes(lowerQuery) ||
      p.tipo_pratica?.toLowerCase().includes(lowerQuery)
    );
  }

  // Account management
  async updateAccountData(email: string, userName: string) {
    if (!this.session) return;

    try {
      const response = await fetch("/api/update-account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.session.access_token}`,
        },
        body: JSON.stringify({ email, userName }),
      });

      if (response.ok) {
        this.userName = userName;
      }
    } catch (error) {
      console.log("Failed to update account:", error);
    }
  }

  async deleteAccount() {
    if (!this.session) return;

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.session.access_token}`,
        },
      });

      if (response.ok) {
        await this.logout();
        goto("/");
      }
    } catch (error) {
      console.log("Failed to delete account:", error);
    }
  }

  async logout() {
    await this.supabase?.auth.signOut();
    goto("/login");
  }
}

const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
  return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
  return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}