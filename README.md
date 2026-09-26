# Kitchen Essentials Kit

<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sua Cozinha - Pote Organizador + Talheres</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #121212;
    --surface: #1e1e1e;
    --ink: #ffffff;
    --muted: #bbbbbb;
    --line: #222222;
    --accent: #00a859;
    --accent-dark: #008f4c;
    --accent-soft: rgba(0, 168, 89, 0.15);
    --gold: #e5a93b;
    --error: #FF8A80;
    --error-soft: #3A1C19;
    --disabled: #33443E;
    --radius: 10px;
    box-sizing: border-box;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  html { scroll-padding-top: env(safe-area-inset-top, 0px); height: 100%; }
  *, *::before, *::after { box-sizing: inherit; margin: 0; padding: 0; }
  
  body {
    margin: 0; min-height: 100%;
    font-family: "Figtree", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: var(--bg); color: var(--ink);
    font-size: 1rem; line-height: 1.6;
    padding-bottom: 70px; /* Espaço para a barra inferior fixa */
  }
  body.travado { overflow: hidden; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  /* ---------- ESTILOS DA LANDING PAGE ---------- */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

  /* Botão Base */
  .btn {
    display: inline-block; width: 100%; min-height: 56px; padding: 14px 20px;
    border: 0; border-radius: 30px;
    background: var(--accent); color: #fff;
    font: inherit; font-weight: 800; font-size: 1.1rem; letter-spacing: .01em;
    cursor: pointer; transition: background-color .2s, transform .2s;
    text-align: center; text-decoration: none;
    box-shadow: 0 4px 15px rgba(0, 168, 89, 0.4);
  }
  .btn:hover:not(:disabled) { background: var(--accent-dark); transform: translateY(-2px); }
  .btn:disabled { background: var(--disabled); color: #888; cursor: not-allowed; box-shadow: none; transform: none; }
  .btn:focus-visible, .link-voltar:focus-visible, a:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

  /* Header */
  header { background-color: #000000; padding: 15px 0; border-bottom: 1px solid var(--line); }
  .nav-container { display: flex; justify-content: space-between; align-items: center; }
  .logo { font-size: 1.2rem; font-weight: bold; color: #fff; }
  .logo span { color: var(--gold); font-size: 0.8rem; display: block; }
  nav ul { display: flex; list-style: none; gap: 20px; }
  nav a { color: #ccc; text-decoration: none; font-size: 0.9rem; }
  nav a:hover { color: #fff; }
  .secure-tag { font-size: 0.8rem; color: #aaa; display: flex; align-items: center; gap: 5px; }

  /* Hero Section */
  .hero { padding: 40px 0; background: radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%); }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
  .badge { background-color: var(--gold); color: #000; font-weight: bold; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; display: inline-block; margin-bottom: 10px; }
  .hero-text h1 { font-size: 2.2rem; margin-bottom: 10px; line-height: 1.2; font-weight: 800; }
  .hero-text p { color: var(--muted); margin-bottom: 20px; }
  .features-list { list-style: none; margin-bottom: 20px; display: flex; gap: 15px; font-size: 0.85rem; color: #ddd; }
  .price-box { background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
  .old-price { text-decoration: line-through; color: #888; font-size: 0.9rem; }
  .current-price { font-size: 2rem; font-weight: 800; color: #fff; }
  .stock-badge { background-color: #d9381e; color: white; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
  .hero-img img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .guarantees { display: flex; gap: 15px; margin-top: 15px; font-size: 0.75rem; color: #aaa; }

  /* Secção O que está incluso */
  .included-section { background-color: #ffffff; color: #111; padding: 60px 0; }
  .included-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; align-items: center; }
  .included-section h2 { font-size: 1.8rem; margin-bottom: 10px; font-weight: 800; }
  .items-list { list-style: none; margin-top: 20px; }
  .items-list li { margin-bottom: 10px; display: flex; align-items: center; gap: 10px; font-weight: 500; }
  .items-list li::before { content: "✓"; background: var(--gold); color: #000; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; justify-content: center; align-items: center; font-size: 12px; font-weight: bold; }
  .included-img img, .side-gallery img { width: 100%; border-radius: 8px; }
  .side-gallery img { margin-bottom: 10px; }

  /* Banner de Benefícios */
  .benefits-bar { background-color: #0a0a0a; padding: 30px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
  .benefit-card h4 { font-size: 0.95rem; margin-top: 8px; }

  /* Secção de Depoimentos */
  .reviews-section { padding: 60px 0; background-color: var(--bg); }
  .reviews-section h2 { margin-bottom: 30px; font-weight: 800; }
  .reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
  .review-card { background-color: var(--surface); padding: 15px; border-radius: 8px; font-size: 0.85rem; border: 1px solid var(--line); }
  .stars { color: var(--gold); margin-bottom: 8px; }
  .author { margin-top: 10px; font-weight: bold; color: #888; font-size: 0.75rem; }

  /* Sticky Footer Bar */
  .sticky-buy { position: fixed; bottom: 0; left: 0; width: 100%; background-color: #000; border-top: 2px solid #333; padding: 10px 0; z-index: 40; }
  .sticky-flex { display: flex; justify-content: space-between; align-items: center; }

  /* ---------- ESTILOS DA ETAPA DE ENDEREÇO ---------- */
  .etapa {
    position: fixed; inset: 0; z-index: 50; overflow-y: auto;
    background: var(--bg);
    padding: max(16px, env(safe-area-inset-top, 0px)) 16px max(24px, env(safe-area-inset-bottom, 0px));
    -webkit-overflow-scrolling: touch;
  }
  .etapa[hidden] { display: none; }
  .etapa-inner { max-width: 600px; margin: 0 auto; }

  .topo { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .link-voltar { background: none; border: 0; padding: 8px 4px; font: inherit; color: var(--muted); cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

  .progresso { list-style: none; margin: 0 0 8px; padding: 0; display: flex; gap: 6px; }
  .progresso li { flex: 1; display: flex; align-items: center; gap: 8px; font-size: .82rem; line-height: 1.2; color: var(--muted); padding: 8px 0; border-top: 3px solid var(--line); }
  .progresso li.atual { color: var(--ink); font-weight: 700; border-top-color: var(--accent); }
  .progresso .n { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: .78rem; font-weight: 800; background: var(--line); color: var(--ink); }
  .progresso li.atual .n { background: var(--accent); color: #fff; }
  .aviso-pagamento { margin: 0 0 16px; font-size: .92rem; color: var(--muted); }

  .card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 20px 16px 22px; }
  .card h2 { margin: 0 0 4px; font-size: 1.4rem; line-height: 1.25; font-weight: 800; }
  .card .sub { margin: 0 0 14px; color: var(--muted); }
  .resumo { display: flex; justify-content: space-between; gap: 12px; padding: 12px 14px; margin-bottom: 18px; background: var(--accent-soft); border-radius: var(--radius); font-size: .95rem; }
  .resumo strong { font-weight: 800; white-space: nowrap; color: #fff; }

  .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 600px) {
    .card { padding: 28px 28px 30px; }
    .grid { grid-template-columns: 1fr 1fr; column-gap: 16px; }
    .grid .cheio { grid-column: 1 / -1; }
  }

  .campo label { display: block; font-weight: 600; font-size: .95rem; margin-bottom: 6px; }
  .campo .opc { font-weight: 400; color: var(--muted); }
  .campo input, .campo select {
    width: 100%; height: 54px; padding: 0 14px;
    font: inherit; font-size: 16px;
    color: var(--ink); background: #121212;
    border: 1.5px solid var(--line); border-radius: var(--radius);
    appearance: none; -webkit-appearance: none;
  }
  .campo select {
    background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%);
    background-position: calc(100% - 20px) 24px, calc(100% - 14px) 24px;
    background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; padding-right: 36px;
  }
  .campo input:focus, .campo select:focus { outline: 3px solid var(--accent-soft); border-color: var(--accent); }
  .campo input[aria-invalid="true"], .campo select[aria-invalid="true"] { border-color: var(--error); background-color: var(--error-soft); }
  .msg { min-height: 0; margin: 6px 0 0; font-size: .86rem; line-height: 1.35; }
  .msg:empty { display: none; }
  .msg.erro { color: var(--error); font-weight: 600; }
  .msg.info { color: var(--muted); }

  .acao { margin-top: 22px; }
  .dica { margin: 10px 0 0; text-align: center; font-size: .88rem; color: var(--muted); }
  .alerta { margin-top: 14px; padding: 12px 14px; border-radius: var(--radius); background: var(--error-soft); color: var(--error); font-weight: 600; font-size: .92rem; }
  .alerta[hidden] { display: none; }
  .sucesso { margin-top: 22px; padding: 16px; border-radius: var(--radius); background: var(--accent-soft); color: var(--ink); font-weight: 700; text-align: center; }
  .sucesso[hidden] { display: none; }

  .confianca { margin: 20px 4px 0; text-align: center; font-size: .9rem; color: var(--muted); }
  .confianca strong { display: block; color: var(--ink); font-size: 1rem; margin-bottom: 2px; }
  .links { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 16px; }
  .links a { color: var(--muted); font-size: .86rem; text-underline-offset: 3px; padding: 6px 0; }

  @media (max-width: 768px) {
    .hero-grid, .included-grid, .benefits-grid, .reviews-grid { grid-template-columns: 1fr; }
    nav, .side-gallery { display: none; }
    .sticky-flex { flex-direction: column; gap: 10px; }
  }




  


    


      


        Sua Cozinha
        mais prática
      


      
        


          

Início


          

Benefícios


          

Depoimentos


        


      
      

🔒 Compra Segura


    



  


    


      


        KIT COMPLETO
        

Pote Organizador + Talheres e Utensílios


        

Tudo o que você precisa para uma cozinha mais prática, bonita e organizada!


        
        


          

✓ Material de alta qualidade


          

✓ Resistente e durável


          

✓ Design moderno


        



        


          


            DE R$ 49,90
            

R$ 12,99


          


          

🔥 Restam apenas 78 unidades


        



        COMPRAR AGORA ❯

        


          🚚 Entrega rápida
          💳 Pagamento seguro
          🛡️ Satisfação garantida
        


      



      


        
      


    



  


    


      


        


          

O QUE ESTÁ INCLUSO?


          

Um kit completo com tudo o que você precisa!


          


            

Colheres


            

Garfos


            

Facas


            

Conchas


            

Espátulas


            

Pegador


            

Fouet (batedor)


            

Pincel


            

Porta utensílios (organizador)


            

E muito mais!


          


        



        


          
        



        


          
          
          
        


      


    



  


    


      


        🛡️
        

Material de alta qualidade


      


      


        ✨
        

Design moderno e elegante


      


      


        🏠
        

Deixa sua cozinha organizada


      


      


        👌
        

Praticidade no dia a dia


      


    



  


    


      

Quem já comprou, recomenda!


      


        


          

★★★★★


          

"Produto excelente! Chegou bem embalado e super completo. Amei!"


          

Juliana S. - Rio de Janeiro / RJ


        


        


          

★★★★★


          

"Muito lindo e de ótima qualidade! Já uso todos os dias."


          

Carlos M. - São Paulo / SP


        


        


          

★★★★★


          

"Realmente vale a pena! Organizou minha cozinha e ficou linda!"


          

Beatriz L. - Minas Gerais / MG


        


        


          

★★★★★


          

"Chegou antes do prazo e tudo certinho. É exatamente o que eu precisava!"


          

Fernanda T. - Bahia / BA


        


      


    



  


    


      


        OFERTA ESPECIAL
        

R$ 12,99 R$ 49,90


      


      COMPRAR AGORA ❯
    



  


    


      


        ← Voltar
      



      


        

1Endereço


        

2Pagamento


        

3Pedido confirmado


      


      

O pagamento acontece somente na próxima etapa. Agora precisamos apenas do endereço de entrega.



      


        

📦 Informe o endereço de entrega


        

Preencha seus dados para calcular e registrar a entrega do seu pedido.



        


          Produto
          
        



        


          



            


              Nome completo *
              
              




            



            


              CPF *
              
              




            



            


              WhatsApp/Telefone *
              
              




            



            


              CEP *
              
              




              




            



            


              Estado *
              
                Selecione
              
              




            



            


              Cidade *
              
              




            



            


              Bairro *
              
              




            



            


              Endereço *

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kit-cozinha-completa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aee9d93e-216a-4b47-8597-cbbe3b109e2e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
