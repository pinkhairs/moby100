import { getWordsApi } from '../server/helpers';
const supertest = require("supertest");
const app = require("../server/app");

describe('Top 100 words in Moby Dick API', (t) => {
    const server = supertest(app);
    test('prints valid JSON', async () => {
        var appTest = await server.get("/api/words")
        .expect(200)
        .then((result) => {
            var json = result.body;
            expect(json).toBeTruthy();
            expect(json.length).toBeGreaterThan(1);
        });
    });
});