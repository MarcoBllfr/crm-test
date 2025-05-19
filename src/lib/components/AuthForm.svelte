<script lang="ts">
    import { Button } from "$components";
    import type { ActionData } from "../../routes/register/$types";
  
      interface ComponentProps{
          isRegistration: boolean;
          form: ActionData;
      }
      let {isRegistration, form}:ComponentProps = $props()
  </script>
  
  <div class="default-margin auth-container">
      <h1 class="mb-l">{isRegistration? "Register" : "Login"}</h1>
      <div class="form-and-social-login">
          <form class="auth-form" method="POST" action={isRegistration ? "" : "/login/?/signInWithPassword"}>
            {#if form && form.errors?.length}
            {#each form.errors as error}
            <div class="auth-error">
              <p>{error}</p>
            </div>
            {/each}
            {/if}
              {#if isRegistration}
                  <input placeholder="Name" type="text" name="name" value={form?.name || ""}/>    
              {/if}
              <input placeholder="Email" type="text" name="email" value={form?.email}/>
              <input placeholder="Password" type="password" name="password" value={form?.password}/>
              {#if isRegistration}
              <input placeholder="Confirm Password" type="password" name="passwordConfirmation" value={form?.passwordConfirmation}/>
              {/if}
              <Button type="submit"> {isRegistration ? "Register" : "Login"}</Button>
              {#if isRegistration}
              <p class="auth-hint">
                  Already have an account? <a href="/login">Log in.</a>
              </p>
              {:else}
              <p class="auth-hint mt-s">
                  Don't have an account? <a href="/register">Create an account.</a>
              </p>    
              {/if}
             
          </form>
      </div>
  </div>
  