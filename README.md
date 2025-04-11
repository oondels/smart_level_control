
# Smart Level Control - Servidor

Projeto backend do **Smart Level Control**, uma solução completa para **monitoramento em tempo real do nível de combustível em tanques**. Este sistema permite visualizar o consumo, receber alertas por e-mail, acompanhar o histórico e gerar gráficos de forma automatizada por meio de uma interface web intuitiva.

## 🚀 Funcionalidades

- 📡 **Leitura em tempo real** dos níveis de combustível via sensores conectados.
- 📊 **Dashboard com gráficos interativos** (nível atual, consumo diário/mensal, histórico).
- 🔔 **Alertas automáticos por e-mail** em caso de níveis críticos (mínimo/máximo).
- 📁 **Histórico completo** de medições e consumo por data e hora.
- 🛠️ API REST para integração com sistemas externos.

## 🧩 Tecnologias Utilizadas

- **Node.js** + **Express** para o backend
- **WebSocket** para comunicação em tempo real com sensores
- **PostgreSQL** para armazenamento das medições e histórico
- **Nodemailer** para envio de e-mails automáticos
- **Docker** (opcional) para facilitar o deploy
- **Chart.js** (na interface gráfica) para exibição dos gráficos

## 🛠️ Instalação e Execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/oondels/smart_level_control.git
   cd smart_level_control/server
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente em um arquivo `.env`:

   ```env
   PORT=3010
   DATABASE_URL=postgres://user:password@host:port/dbname
   EMAIL_HOST=smtp.exemplo.com
   EMAIL_PORT=587
   EMAIL_USER=seu@email.com
   EMAIL_PASS=sua_senha
   ALERT_THRESHOLD=20
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

## 📡 API Endpoints

| Método | Rota                  | Descrição                           |
|--------|-----------------------|-------------------------------------|
| GET    | `/api/levels`         | Lista os níveis registrados         |
| GET    | `/api/levels/:id`     | Detalhes de um registro específico |
| POST   | `/api/levels`         | Registra um novo nível             |
| GET    | `/api/history`        | Retorna o histórico de consumo     |
| POST   | `/api/alert`          | Dispara alerta manualmente         |

## 💡 Exemplo de Uso

Um sensor de nível envia dados para o servidor via WebSocket. O backend armazena esses dados no PostgreSQL, atualiza o gráfico na interface em tempo real e, caso o nível esteja abaixo do limite, envia um alerta por e-mail para o operador responsável.

## 📬 Alerta por E-mail

O sistema envia e-mails automáticos quando:

- O nível de combustível está abaixo do limite mínimo definido.
- Há falhas na comunicação com o sensor (offline).
- Existe uma taxa de consumo anormal detectada.

## 📈 Interface Gráfica

A interface web (localizada na pasta `client/`) permite:

- Acompanhamento em tempo real
- Visualização gráfica do histórico
- Filtros por período
- Consulta de alertas emitidos

## 📚 Histórico de Consumo

Todos os dados são persistidos no banco de dados, com possibilidade de exportação futura em CSV ou integração com outros sistemas via API.

## 📦 Docker (Opcional)

O projeto possui suporte a contêineres para facilitar a implantação:

```bash
docker-compose up -d
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir *Issues* ou enviar um *Pull Request* com melhorias.

---

**Desenvolvido por [@oondels](https://github.com/oondels) com paixão por automação e monitoramento inteligente.**
