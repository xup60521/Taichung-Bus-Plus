export function setURLParams({URL_params_string, name, value}: 
    {URL_params_string: string, name: string, value: string}) {

        const urlparams = new URLSearchParams(URL_params_string)
        urlparams.set(name, value)
        return urlparams.toString()

}