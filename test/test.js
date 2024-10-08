const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../index');
const fs = require('fs/promises');


chai.use(chaiHttp);

describe('GET /animes', () => {
  it('Deberia devolver un array de animes', async () => {
    const res = await chai.request(server).get('/animes');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('Deberia devolver un anime por nombre', async () => {
    const nombre = 'Akira'; 
    const res = await chai.request(server).get(`/animes?nombre=${nombre}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('nombre', nombre);
  });
});

describe('POST /animes', () => {
  it('Deberia crear un nuevo anime', async () => {
    const datosAnime = {
      nombre: 'Naruto',
      genero: 'Accion',
      año: 'Un anime de accion',
      autor: 'Katsuhiro Otomo'
    };

    const res = await chai.request(server)
      .post('/animes')
      .send(datosAnime);

    expect(res).to.have.status(200);
    expect(res.text).to.equal('Anime creado con éxito');

    // Verificamos que el anime se haya creado en el archivo anime.json
    const animes = await fs.readFile('./anime.json');
    const animesJson = JSON.parse(animes);
    expect(animesJson).to.have.property(Object.keys(animesJson).length.toString());
    expect(animesJson[Object.keys(animesJson).length.toString()]).to.deep.equal(datosAnime);
  });

});

//utilice mocha y chai, para ejeucutar la prueba debe ejecutar el comando: npx mocha, en la terminal
//realice dos preubas para GET y un para POST 
