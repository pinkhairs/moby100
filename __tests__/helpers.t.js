import { getWordsApi } from '../server/helpers.js';

describe('Get words API test', function () {

    test('returns an array', () => {
        const req = {  };

        const res = { text: '',
            send: function(input) { this.text = input } 
        };

        const words = getWordsApi(req, res);
        
        const parseJson = () => {
          var json = JSON.stringify(words);
          return JSON.parse(json);
        };
  
        expect(parseJson).not.toThrow();
    });

});