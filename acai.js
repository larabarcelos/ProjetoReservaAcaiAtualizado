// Controla a quantidade máxima de opções selecionadas em cada grupo.
const limites = {
    complementos: 4,
    coberturas: 2,
    frutas: 2,
    toppings: 1
};

const textosContadores = {
    complementos: ["selecionados", "selecionados"],
    coberturas: ["selecionadas", "selecionadas"],
    frutas: ["selecionadas", "selecionadas"],
    toppings: ["selecionado", "selecionados"]
};

function atualizarContador(grupo) {
    const selecionados = document.querySelectorAll(
        `input[name="${grupo}"]:checked`
    ).length;

    const contador = document.getElementById(`contador-${grupo}`);
    if (contador) {
        const palavra = grupo === "complementos" ? "selecionados" :
            grupo === "coberturas" ? "selecionadas" :
            grupo === "frutas" ? "selecionadas" : "selecionado";

        contador.textContent = `${selecionados} de ${limites[grupo]} ${palavra}`;
    }
}

Object.entries(limites).forEach(([grupo, limite]) => {
    const caixas = document.querySelectorAll(`input[name="${grupo}"]`);

    caixas.forEach((caixa) => {
        caixa.addEventListener("change", () => {
            const selecionados = document.querySelectorAll(
                `input[name="${grupo}"]:checked`
            );

            if (selecionados.length > limite) {
                caixa.checked = false;
                alert(`Você pode escolher no máximo ${limite} opção(ões) nesta categoria.`);
            }

            atualizarContador(grupo);
        });
    });

    atualizarContador(grupo);
});

// Monta uma revisão do pedido antes de concluir.
const formulario = document.getElementById("formPedido");
const resultado = document.getElementById("resultadoPedido");

function obterSelecionados(grupo) {
    return Array.from(
        document.querySelectorAll(`input[name="${grupo}"]:checked`)
    ).map((item) => item.value);
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) {
        return;
    }

    const dados = new FormData(formulario);
    const nome = dados.get("nome");
    const telefone = dados.get("telefone");
    const endereco = dados.get("endereco");
    const acai = dados.get("acai");
    const tamanho = dados.get("tamanho");
    const observacoes = dados.get("observacoes") || "Nenhuma";

    const complementos = obterSelecionados("complementos");
    const coberturas = obterSelecionados("coberturas");
    const frutas = obterSelecionados("frutas");
    const toppings = obterSelecionados("toppings");

    resultado.innerHTML = `
        <h3>Confira seu pedido, ${escaparHTML(nome)}!</h3>
        <p><strong>Telefone:</strong> ${escaparHTML(telefone)}</p>
        <p><strong>Endereço:</strong> ${escaparHTML(endereco)}</p>
        <p><strong>Açaí:</strong> ${escaparHTML(acai)}</p>
        <p><strong>Tamanho:</strong> ${escaparHTML(tamanho)}</p>
        <p><strong>Complementos:</strong> ${formatarLista(complementos)}</p>
        <p><strong>Coberturas:</strong> ${formatarLista(coberturas)}</p>
        <p><strong>Frutas:</strong> ${formatarLista(frutas)}</p>
        <p><strong>Topping:</strong> ${formatarLista(toppings)}</p>
        <p><strong>Observações:</strong> ${escaparHTML(observacoes)}</p>
        <p><strong>Revisão:</strong> os dados foram organizados nesta página. Este formulário ainda não envia o pedido para a loja.</p>
    `;

    resultado.classList.add("visivel");
    resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function formatarLista(lista) {
    return lista.length ? lista.map(escaparHTML).join(", ") : "Nenhum";
}

// Evita que o texto digitado pelo cliente seja interpretado como HTML.
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, (caractere) => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return entidades[caractere];
    });
}
