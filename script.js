const produtos = [
  { id: 1, nome: 'Coxinha', preco: 5.00, emoji: '🥟' },
  { id: 2, nome: 'Refrigerante', preco: 4.00, emoji: '🥤' },
  { id: 3, nome: 'Hambúrguer', preco: 8.00, emoji: '🍔' },
  { id: 4, nome: 'Suco', preco: 3.50, emoji: '🧃' }
];

let carrinho = [];
let saldo = 35.00;
let pedidosNaFrente = 3;

const listaProdutos = document.getElementById('listaProdutos');
const itensCarrinho = document.getElementById('itensCarrinho');
const totalCarrinho = document.getElementById('totalCarrinho');
const saldoAluno = document.getElementById('saldoAluno');
const filaPedidos = document.getElementById('filaPedidos');
const toast = document.getElementById('toast');

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarMensagem(texto) {
  toast.textContent = texto;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function carregarProdutos() {
  listaProdutos.innerHTML = produtos.map(produto => `
    <div class="product-item">
      <div class="product-info">
        <strong>${produto.emoji} ${produto.nome}</strong>
        <span>${formatarMoeda(produto.preco)}</span>
      </div>
      <button class="add-btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
    </div>
  `).join('');
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(item => item.id === id);
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  renderizarCarrinho();
  mostrarMensagem(`${produto.nome} adicionado ao carrinho.`);
}

function removerDoCarrinho(id) {
  const item = carrinho.find(produto => produto.id === id);

  if (!item) return;

  item.quantidade -= 1;

  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(produto => produto.id !== id);
  }

  renderizarCarrinho();
  mostrarMensagem('Produto removido do carrinho.');
}

function calcularTotal() {
  return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function renderizarCarrinho() {
  if (carrinho.length === 0) {
    itensCarrinho.className = 'cart-items empty-cart';
    itensCarrinho.innerHTML = 'Nenhum produto adicionado.';
    totalCarrinho.textContent = formatarMoeda(0);
    return;
  }

  itensCarrinho.className = 'cart-items';
  itensCarrinho.innerHTML = carrinho.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.nome}</strong>
        <small>Qtd: ${item.quantidade} • ${formatarMoeda(item.preco * item.quantidade)}</small>
      </div>
      <button class="remove-btn" onclick="removerDoCarrinho(${item.id})">Remover</button>
    </div>
  `).join('');

  totalCarrinho.textContent = formatarMoeda(calcularTotal());
}

function finalizarPedido() {
  const total = calcularTotal();

  if (carrinho.length === 0) {
    mostrarMensagem('Adicione algum produto antes de finalizar.');
    return;
  }

  if (total > saldo) {
    mostrarMensagem('Saldo insuficiente para finalizar o pedido.');
    return;
  }

  saldo -= total;
  saldoAluno.textContent = formatarMoeda(saldo);
  carrinho = [];
  renderizarCarrinho();

  pedidosNaFrente = 3;
  filaPedidos.textContent = pedidosNaFrente;
  document.getElementById('statusPronto').classList.remove('ready', 'active');

  mostrarMensagem('Pedido finalizado com sucesso! Código: #PD-4821');
}

function atualizarStatusPedido() {
  if (pedidosNaFrente > 0) {
    pedidosNaFrente -= 1;
    filaPedidos.textContent = pedidosNaFrente;
    mostrarMensagem('Status atualizado. Seu pedido está avançando.');
  }

  if (pedidosNaFrente === 0) {
    const pronto = document.getElementById('statusPronto');
    pronto.classList.add('ready');
    pronto.classList.add('active');
    mostrarMensagem('Seu pedido está pronto para retirada!');
  }
}

function mostrarDetalhes() {
  mostrarMensagem('Pedido #PD-4821: aguardando preparo na cantina.');
}

carregarProdutos();
renderizarCarrinho();
