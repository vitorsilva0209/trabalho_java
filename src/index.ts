interface Reservavel {
    reservar(usuario: string): boolean;
    cancelarReserva(): boolean;
}

abstract class ItemAcervo {
    private static _contadorId: number = 1;
    readonly id: number;
    private _titulo: string;
    private _anoPublicacao: number;
    private _emprestado: boolean;
    private _usuarioAtual: string | null;

    constructor(titulo: string, anoPublicacao: number) {
        this.id = ItemAcervo._contadorId++;
        this._titulo = titulo;
        this._anoPublicacao = anoPublicacao;
        this._emprestado = false;
        this._usuarioAtual = null;
    }

    get titulo(): string {
        return this._titulo;
    }

    get anoPublicacao(): number {
        return this._anoPublicacao;
    }

    get emprestado(): boolean {
        return this._emprestado;
    }

    get usuarioAtual(): string | null {
        return this._usuarioAtual;
    }

    emprestar(usuario: string): void {
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

    devolver(): void {
        if (!this._emprestado) {
            throw new Error(`O item "${this._titulo}" já consta como disponível.`);
        }
        console.log(`Devolução realizada: "${this._titulo}" (estava com ${this._usuarioAtual}).`);
        this._emprestado = false;
        this._usuarioAtual = null;
    }

    get statusDisponibilidade(): string {
        return this._emprestado ? `Emprestado para ${this._usuarioAtual}` : "Disponível";
    }

    abstract calcularMulta(diasAtraso: number): number;
}

class Livro extends ItemAcervo {
    private _autor: string;
    private _numeroPaginas: number;

    constructor(titulo: string, anoPublicacao: number, autor: string, numeroPaginas: number) {
        super(titulo, anoPublicacao);
        this._autor = autor;
        this._numeroPaginas = numeroPaginas;
    }

    get autor(): string {
        return this._autor;
    }

    override calcularMulta(diasAtraso: number): number {
        if (diasAtraso <= 0) return 0;
        return diasAtraso * 2.0;
    }
}

class JogoEletronico extends ItemAcervo implements Reservavel {
    private _plataforma: string;
    private _reservadoPara: string | null;

    constructor(titulo: string, anoPublicacao: number, plataforma: string) {
        super(titulo, anoPublicacao);
        this._plataforma = plataforma;
        this._reservadoPara = null;
    }

    get plataforma(): string {
        return this._plataforma;
    }

    override calcularMulta(diasAtraso: number): number {
        if (diasAtraso <= 0) return 0;
        return diasAtraso * 4.5;
    }

    reservar(usuario: string): boolean {
        if (this._reservadoPara) {
            console.log(`O jogo "${this.titulo}" já está reservado.`);
            return false;
        }
        this._reservadoPara = usuario;
        console.log(`Reserva efetuada: O jogo "${this.titulo}" foi reservado por ${usuario}.`);
        return true;
    }

    cancelarReserva(): boolean {
        if (!this._reservadoPara) {
            console.log(`Não há reservas ativas para "${this.titulo}".`);
            return false;
        }
        console.log(`Reserva cancelada para o jogo "${this.titulo}".`);
        this._reservadoPara = null;
        return true;
    }
}

class RepositorioMemoria<T extends ItemAcervo> {
    private _itens: T[] = [];

    adicionar(item: T): void {
        this._itens.push(item);
        console.log(`Item ID ${item.id} (${item.titulo}) adicionado com sucesso.`);
    }

    buscarPorId(id: number): T {
        const itemEncontrado = this._itens.find(item => item.id === id);
        if (!itemEncontrado) {
            throw new Error(`Item com ID ${id} não foi encontrado no acervo.`);
        }
        return itemEncontrado;
    }

    listarTodos(): T[] {
        return [...this._itens];
    }
}

console.log("INICIANDO SISTEMA DE GESTÃO DE ACERVO");

const repositorio = new RepositorioMemoria<ItemAcervo>();

const livro1 = new Livro("Senhor dos Anéis", 1954, "J.R.R. Tolkien", 1200);
const jogo1 = new JogoEletronico("Elden Ring", 2022, "PlayStation 5");

repositorio.adicionar(livro1);
repositorio.adicionar(jogo1);

try {
    livro1.emprestar("Carlos Silva");
    console.log(`Status do Livro: ${livro1.statusDisponibilidade}`);
} catch (erro: any) {
    console.error(`Erro Capturado: ${erro.message}`);
}

jogo1.reservar("Mariana Souza");

const diasDeAtraso = 3;
console.log(`Multa para o Livro: R$ ${livro1.calcularMulta(diasDeAtraso).toFixed(2)}`);
console.log(`Multa para o Jogo: R$ ${jogo1.calcularMulta(diasDeAtraso).toFixed(2)}`);

livro1.devolver();
console.log(`Status atualizado do Livro: ${livro1.statusDisponibilidade}`);