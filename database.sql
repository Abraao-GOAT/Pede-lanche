CREATE DATABASE IF NOT EXISTS pedelanche;
USE pedelanche;

CREATE TABLE alunos (
  id_aluno INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  turma VARCHAR(30) NOT NULL,
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saldo_aluno (
  id_saldo INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno)
);

CREATE TABLE produtos (
  id_produto INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  id_aluno INT NOT NULL,
  status_pedido ENUM('Pedido recebido', 'Em preparo', 'Pronto para retirada', 'Retirado', 'Cancelado') DEFAULT 'Pedido recebido',
  data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno)
);

CREATE TABLE itens_pedido (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE pagamentos (
  id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  forma_pagamento ENUM('Saldo do aluno', 'Pix', 'Cartão', 'Dinheiro') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status_pagamento ENUM('Pendente', 'Pago', 'Falhou', 'Estornado') DEFAULT 'Pendente',
  data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

INSERT INTO alunos (nome, turma, email, senha) VALUES
('Abraão', '1º Ano', 'abraao@escola.com', 'senha_criptografada');

INSERT INTO saldo_aluno (id_aluno, saldo) VALUES
(1, 35.00);

INSERT INTO produtos (nome, preco, estoque) VALUES
('Coxinha', 5.00, 40),
('Refrigerante', 4.00, 50),
('Hambúrguer', 8.00, 25),
('Suco', 3.50, 35);

INSERT INTO pedidos (codigo, id_aluno, status_pedido, total) VALUES
('#PD-4821', 1, 'Em preparo', 13.00);

INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 1, 5.00, 5.00),
(1, 3, 1, 8.00, 8.00);

INSERT INTO pagamentos (id_pedido, forma_pagamento, valor, status_pagamento) VALUES
(1, 'Saldo do aluno', 13.00, 'Pago');
