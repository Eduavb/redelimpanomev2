export const criarDocumentoAutentique = async (cliente) => {
  const AUTENTIQUE_TOKEN = '3edf863a79e41533189bdb5cbd57a3e2d3c282fd82c44bb9505cb0978abb46c7'

  const query = `
    mutation CreateDocument {
      createDocument(input: {
        path: "Ficha-${cliente.nome}-${cliente.cpf}.pdf",
        name: "Ficha Associativa",
        signers: [{
          email: "${cliente.cpf.replace(/\D/g, '')}@exemplo.com",
          action: SIGN,
          name: "${cliente.nome}"
        }],
        file: {
          url: "https://link-da-sua-ficha-base-preenchida.com/modelo.pdf"
        }
      }) {
        document {
          id
          name
          public
        }
      }
    }
  `

  const res = await fetch('https://api.autentique.com.br/v2/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AUTENTIQUE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })

  const json = await res.json()
  const docId = json.data?.createDocument?.document?.id
  return `https://app.autentique.com.br/documentos/${docId}`
}
