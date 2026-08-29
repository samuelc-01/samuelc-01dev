<div align="center">

# Samuel Cristian — Portfolio

Landing page pessoal de **Samuel Cristian dos Santos**, desenvolvedor Full Stack com formação técnica em eletrônica.

[![Deploy](https://img.shields.io/badge/deploy-Netlify-43D1C7?style=flat-square&logo=netlify&logoColor=white)](https://app.netlify.com/drop)
![HTML5](https://img.shields.io/badge/HTML5-e34f26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build_step-none-8a97ad?style=flat-square)

</div>

---

## Sobre

Site estático em HTML, CSS e JavaScript puros — sem framework, sem build step. Reúne experiência profissional, stack técnica e projetos, com um pequeno terminal animado no topo como assinatura visual.

**🔗 Demo:** _adicione aqui o link depois do deploy_

## Estrutura

```
.
├── index.html          # Marcação semântica da página
├── css/
│   └── style.css        # Estilos organizados por seção, com variáveis de cor (design tokens)
├── js/
│   └── main.js           # Efeito de terminal + scroll reveal (respeita prefers-reduced-motion)
├── assets/               # Imagens e ícones
└── netlify.toml           # Configuração de deploy e headers de segurança
```

## Como rodar localmente

Sem dependências e sem build. Basta abrir o arquivo ou usar um servidor local:

```bash
git clone https://github.com/samuelc-01/samuel-portfolio.git
cd samuel-portfolio

# opção 1
npx serve .

# opção 2
python3 -m http.server 8080
```

## Deploy

O projeto já vem com `netlify.toml`, pronto para deploy contínuo:

1. Faça fork ou clone deste repositório.
2. Em [app.netlify.com](https://app.netlify.com), clique em **Add new site → Import an existing project**.
3. Selecione o repositório — build command vazio, publish directory `.`.

Também funciona via [Netlify Drop](https://app.netlify.com/drop), arrastando a pasta do projeto sem precisar de repositório.

## Tecnologias

- **HTML5** semântico
- **CSS3** com variáveis nativas (custom properties), grid e flexbox
- **JavaScript** vanilla (ES6+), sem dependências
- Fontes via Google Fonts: `Space Grotesk`, `Inter`, `JetBrains Mono`

## Contato

- GitHub: [github.com/samuelc-01](https://github.com/samuelc-01)
- LinkedIn: [linkedin.com/in/samuel-cristian](https://linkedin.com/in/samuel-cristian)
- E-mail: samuelc.01dev@gmail.com

---

<div align="center">
<sub>Feito por Samuel Cristian dos Santos — Divinópolis, MG</sub>
</div>
