import type { SupabaseClient, Session, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";
interface UserStateProps{
    session : Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
}

export class UserState{
    session = $state<Session | null>(null);
    supabase= $state<SupabaseClient | null>(null);
    user=$state<User |null >(null);

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
}
}
export interface Clienti{
    cod_fisc: string
          cognome: string | null
          created_at: string
          d_scad_tess: string | null
          data_tess: string | null
          email: string | null
          id_cliente: number
          nome: string | null
          telefono: string | null
          tesserato: boolean | null
          user_id: string | null
}
export interface Lista_Pratiche{
         created_at: string
          data: string | null
          esito: string | null
          id: number
          id_cliente: number | null
          id_pratica: number | null
          note: string | null
          user_id: string | null
}

export interface Pratiche{
    cod_pratica: string
          id_pratica: number
          nome_pratica: string | null
          punteggio: number | null
          tipo_pratica: string | null
          user_id: string | null
}

const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
  return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
  return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}