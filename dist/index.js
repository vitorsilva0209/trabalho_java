"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemAcervo {
    static _contadorId = 1;
    id;
    _titulo;
    _anoPublicacao;
    _emprestado;
    _usuarioAtual;
    constructor(titulo, anoPublicacao) {
        this.id = ItemAcervo._contadorId++;
        this._titulo = titulo;
        this._anoPublicacao = anoPublicacao;
        this._emprestado = false;
        this._usuarioAtual = null;
    }
    get titulo() {
        return this._titulo;
    }
    get anoPublicacao() {
        return this._anoPublicacao;
    }
    get emprestado() {
        return this._emprestado;
    }
    get usuarioAtual() {
        return this._usuarioAtual;
    }
    emprestar(usuario) {
        if (this._emprestado) {
            throw new Error(`O item "${this._titulo}" já está emprestado.`);
        }
        if (!usuario.trim()) {
            throw new Error("O nome do usuário não pode ser vazio.");
        }
        this._emprestado = true;
        this._usuarioAtual = usuario;
        console.log(`Empréstimo realizado: "${this._titulo}" para ${usuario}.`);
    }
    devolver() {
        if (!this._emprestado) {
            throw new Error(`O item "${this._titulo}" já consta como disponível.`);
        }
        console.log(`Devolução realizada: "${this._titulo}" (estava com ${this._usuarioAtual}).`);
        this._emprestado = false;
        this._usuarioAtual = null;
    }
    get statusDisponibilidade() {
        return this._emprestado ? `Emprestado para ${this._usuarioAtual}` : "Disponível";
    }
}
class Livro extends ItemAcervo {
    _autor;
    _numeroPaginas;
    constructor(titulo, anoPublicacao, autor, numeroPaginas) {
        super(titulo, anoPublicacao);
        this._autor = autor;
        this._numeroPaginas = numeroPaginas;
    }
    get autor() {
        return this._autor;
    }
    calcularMulta(diasAtraso) {
        if (diasAtraso <= 0)
            return 0;
        return diasAtraso * 2.0;
    }
}
class JogoEletronico extends ItemAcervo {
    _plataforma;
    _reservadoPara;
    constructor(titulo, anoPublicacao, plataforma) {
        super(titulo, anoPublicacao);
        this._plataforma = plataforma;
        this._reservadoPara = null;
    }
    get plataforma() {
        return this._plataforma;
    }
    calcularMulta(diasAtraso) {
        if (diasAtraso <= 0)
            return 0;
        return diasAtraso * 4.5;
    }
    reservar(usuario) {
        if (this._reservadoPara) {
            console.log(`O jogo "${this.titulo}" já está reservado.`);
            return false;
        }
        this._reservadoPara = usuario;
        console.log(`Reserva efetuada: O jogo "${this.titulo}" foi reservado por ${usuario}.`);
        return true;
    }
    cancelarReserva() {
        if (!this._reservadoPara) {
            console.log(`Não há reservas ativas para "${this.titulo}".`);
            return false;
        }
        console.log(`Reserva cancelada para o jogo "${this.titulo}".`);
        this._reservadoPara = null;
        return true;
    }
}
class RepositorioMemoria {
    _itens = [];
    adicionar(item) {
        this._itens.push(item);
        console.log(`Item ID ${item.id} (${item.titulo}) adicionado com sucesso.`);
    }
    buscarPorId(id) {
        const itemEncontrado = this._itens.find(item => item.id === id);
        if (!itemEncontrado) {
            throw new Error(`Item com ID ${id} não foi encontrado no acervo.`);
        }
        return itemEncontrado;
    }
    listarTodos() {
        return [...this._itens];
    }
}
console.log("INICIANDO SISTEMA DE GESTÃO DE ACERVO");
const repositorio = new RepositorioMemoria();
const livro1 = new Livro("Senhor dos Anéis", 1954, "J.R.R. Tolkien", 1200);
const jogo1 = new JogoEletronico("Elden Ring", 2022, "PlayStation 5");
repositorio.adicionar(livro1);
repositorio.adicionar(jogo1);
try {
    livro1.emprestar("Carlos Silva");
    console.log(`Status do Livro: ${livro1.statusDisponibilidade}`);
}
catch (erro) {
    console.error(`Erro Capturado: ${erro.message}`);
}
jogo1.reservar("Mariana Souza");
const diasDeAtraso = 3;
console.log(`Multa para o Livro: R$ ${livro1.calcularMulta(diasDeAtraso).toFixed(2)}`);
console.log(`Multa para o Jogo: R$ ${jogo1.calcularMulta(diasDeAtraso).toFixed(2)}`);
livro1.devolver();
console.log(`Status atualizado do Livro: ${livro1.statusDisponibilidade}`);
//# sourceMappingURL=index.js.map