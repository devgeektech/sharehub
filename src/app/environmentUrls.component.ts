
/*
 Please comment according to environment
 */
/**================Api EndPoints for Dev server======================= */
//export const envApiUrl = "http://138.197.47.224:3000/api/"

/**================Api EndPoints for Live server======================= */

//export const envApiUrl = "http://165.227.56.54:3000/api/"



export class endPointUrl {

    public static getEnvironmentVariable(value:any) {
        var environment:string;
        var data = {};
        environment = window.location.hostname;
        switch (environment) {
             case 'merriment.io':
                data = {
                    endPoint: 'https://api.merriment.io/api/'
                };
                break;
                 case 'www.merriment.io':
                data = {
                    endPoint: 'https://api.merriment.io/api/'
                };
                break;

            default:
                data = {
                    endPoint: 'http://138.197.47.224:3000/api/'
                };
        }
        return data[value];
    }
}