<script lang="ts">
	import { getUserState } from "$components/state/user-state.svelte";
  
  const userState = getUserState();
  const clientiPratiche = userState.praticheComplete;
  console.log(clientiPratiche)
</script>

<div class="pratiche-container">
  <div class="default-margin">
    <div class="header-section">
      <h1 class="mb-m">Pratiche Principali</h1>
      <div class="underscore mb-l"></div>
    </div>
    
    {#if clientiPratiche.length > 0}
      <div class="pratiche-content">
        <!-- Vista Mobile: Cards -->
        <div class="mobile-view">
          {#each clientiPratiche as pratica}
            <div class="pratica-card">
              <div class="card-header">
                <h3 class="client-name">{pratica.cliente_nome} {pratica.cliente_cognome}</h3>
                <span class="esito-badge" class:esito-success={pratica.esito === 'Positivo'} 
                      class:esito-pending={pratica.esito === 'In corso'} 
                      class:esito-error={pratica.esito === 'Negativo'}>
                  {pratica.esito || 'In attesa'}
                </span>
              </div>
              
              <div class="card-body">
                <div class="info-row">
                  <span class="label">Codice Fiscale:</span>
                  <span class="value">{pratica.cliente_cod_fisc}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Tipo Pratica:</span>
                  <span class="value">{pratica.pratica_tipo}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Nome Pratica:</span>
                  <span class="value">{pratica.pratica_nome}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Codice Pratica:</span>
                  <span class="value code">{pratica.pratica_codice}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Data:</span>
                  <span class="value">{pratica.data}</span>
                </div>
                
                {#if pratica.note}
                  <div class="info-row note-row">
                    <span class="label">Note:</span>
                    <span class="value note">{pratica.note}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Vista Desktop: Tabella -->
        <div class="desktop-view">
          <div class="table-wrapper">
            <table class="pratiche-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Codice Fiscale</th>
                  <th>Tipo Pratica</th>
                  <th>Nome Pratica</th>
                  <th>Codice</th>
                  <th>Esito</th>
                  <th>Data</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {#each clientiPratiche as pratica}
                  <tr>
                    <td class="client-cell">
                      <div class="client-info">
                        <span class="client-name">{pratica.cliente_nome}</span>
                        <span class="client-surname">{pratica.cliente_cognome}</span>
                      </div>
                    </td>
                    <td class="code-cell">{pratica.cliente_cod_fisc}</td>
                    <td>{pratica.pratica_tipo}</td>
                    <td>{pratica.pratica_nome}</td>
                    <td class="code-cell">{pratica.pratica_codice}</td>
                    <td>
                      <span class="esito-badge" 
                            class:esito-success={pratica.esito === 'Positivo'} 
                            class:esito-pending={pratica.esito === 'In corso'} 
                            class:esito-error={pratica.esito === 'Negativo'}>
                        {pratica.esito || 'In attesa'}
                      </span>
                    </td>
                    <td>{pratica.data}</td>
                    <td class="note-cell">
                      {#if pratica.note}
                        <span class="note-text" title={pratica.note}>
                          {pratica.note.length > 30 ? pratica.note.substring(0, 30) + '...' : pratica.note}
                        </span>
                      {:else}
                        <span class="no-note">-</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {:else}
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 class="mb-s">Nessuna pratica trovata</h3>
        <p class="dark-grey">Non sono ancora state inserite pratiche nel sistema.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .pratiche-container {
    min-height: 100vh;
    padding: 2rem 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .header-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .pratiche-content {
    width: 100%;
  }

  /* Vista Mobile (default) */
  .mobile-view {
    display: block;
  }

  .desktop-view {
    display: none;
  }

  .pratica-card {
    background: white;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .pratica-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    background: linear-gradient(135deg, #000 0%, #333 100%);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .client-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
  }

  .card-body {
    padding: 1.5rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .info-row:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: #5e5e5e;
    font-size: 0.9rem;
    flex-shrink: 0;
    margin-right: 1rem;
  }

  .value {
    text-align: right;
    font-weight: 400;
    word-break: break-word;
  }

  .value.code {
    font-family: 'Courier New', monospace;
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .note-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .note-row .value {
    text-align: left;
    margin-top: 0.5rem;
    font-style: italic;
    color: #6c757d;
  }

  .esito-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .esito-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .esito-pending {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .esito-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  /* Vista Desktop */
  @media (min-width: 1024px) {
    .mobile-view {
      display: none;
    }

    .desktop-view {
      display: block;
    }

    .table-wrapper {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .pratiche-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    .pratiche-table th {
      background: linear-gradient(135deg, #000 0%, #333 100%);
      color: white;
      padding: 1.25rem 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pratiche-table td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }

    .pratiche-table tr:hover {
      background: #f8f9fa;
    }

    .pratiche-table tr:last-child td {
      border-bottom: none;
    }

    .client-cell {
      font-weight: 500;
    }

    .client-info {
      display: flex;
      flex-direction: column;
    }

    .client-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .client-surname {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .code-cell {
      font-family: 'Courier New', monospace;
      background: #f8f9fa;
      font-size: 0.85rem;
      border-radius: 4px;
    }

    .note-cell {
      max-width: 200px;
    }

    .note-text {
      font-style: italic;
      color: #6c757d;
    }

    .no-note {
      color: #dee2e6;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    .pratica-card {
      margin-bottom: 2rem;
    }

    .card-header {
      padding: 2rem;
    }

    .card-body {
      padding: 2rem;
    }

    .info-row {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
    }
  }

  /* Mobile piccoli */
  @media (max-width: 480px) {
    .pratiche-container {
      padding: 1rem 0;
    }

    .card-header {
      padding: 1rem;
      flex-direction: column;
      align-items: flex-start;
    }

    .client-name {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .card-body {
      padding: 1rem;
    }

    .info-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .value {
      text-align: left;
    }

    .esito-badge {
      align-self: flex-start;
      margin-top: 0.5rem;
    }
  }
</style>