import { world, system } from "@minecraft/server";
import commandManager from "./api/commands/commandManager";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";
let webhookURL = world.getDynamicProperty("simplediscordbroadcaster:webhookURL")


commandManager.addCommand("url", {description: "Config: URL"}, ({msg,args})=>{
    world.setDynamicProperty("simplediscordbroadcaster:webhookURL", `${args.join(' ')}`)
    webhookURL = world.getDynamicProperty("simplediscordbroadcaster:webhookURL")
    world.sendMessage(`${webhookURL}`) // Remove this
})
system.afterEvents.scriptEventReceive.subscribe((e) => {
    const request = new HttpRequest(`${webhookURL}`);
    
    request.method = HttpRequestMethod.Post;

    request.body = JSON.stringify({
        embeds: [
            {
              "title": `${e.sourceEntity.name} sent a scriptevent!`,
              "description": `${e.sourceEntity.name} sent scriptevent ${e.id} with message ${e.message}`,
              "color": 1127128
            }
          ]
    });


    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];

    http.request(request).then((response) => {
        response.body;
    });
})
world.afterEvents.entityDie.subscribe(e => {
    if (!e.deadEntity.typeId === "minecraft:player") return;
    const request = new HttpRequest(`${webhookURL}`);
    
    request.method = HttpRequestMethod.Post;

    

    let damagingEntity = "No one";

    if (e.damagingEntity) {
        damagingEntity = e.damagingEntity.name;
    }

    let deadEntity = e.deadEntity.name ? e.deadEntity.name: e.deadEntity.typeId

    request.body = JSON.stringify({
        embeds: [
            {
              "title": `${deadEntity} died!`,
              "description": `Damage cause: ${e.damageSource.cause}`,
              "color": 1127128
            }
          ]
    });

    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];

    http.request(request).then((response) => {
        response.body;
    });
})
world.afterEvents.playerJoin.subscribe(e => {
    const request = new HttpRequest(`${webhookURL}`);
    
    request.method = HttpRequestMethod.Post;

    let damagingEntity = "No one";

    let date = new Date();

    request.body = JSON.stringify({
        embeds: [
            {
              "title": `${e.playerName} joined!`,
              "description": `${e.playerName} joined at ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
              "color": 1127128
            }
          ]
    });


    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];

    http.request(request).then((response) => {
        response.body;
    });
})
world.afterEvents.entityDie.subscribe(e => {
    const request = new HttpRequest(`${webhookURL}`);
    
    request.method = HttpRequestMethod.Post;

    

    let damagingEntity = "No one";

    if (e.damagingEntity) {
        damagingEntity = e.damagingEntity.name;
    }

    request.body = JSON.stringify({
        embeds: [
            {
              "title": `${e.deadEntity.name} died!`,
              "description": `Damage cause: ${e.damageSource.cause}`,
              "color": 1127128
            }
          ]
    });

    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];

    http.request(request).then((response) => {
        response.body;
    });
})

world.afterEvents.playerLeave.subscribe(e =>{
    const request = new HttpRequest(`${webhookURL}`);
    
    request.method = HttpRequestMethod.Post;

    let date = new Date()

    let damagingEntity = "No one";

    if (e.damagingEntity) {
        damagingEntity = e.damagingEntity.name;
    }

    request.body = JSON.stringify({
        embeds: [
            {
              "title": `${e.playerName} left!`,
              "description": `${e.playerName} left at ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
              "color": 1127128
            }
          ]
    });

    request.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];

    http.request(request).then((response) => {
        response.body;
    });
})

world.beforeEvents.chatSend.subscribe((data) => {
    if (data.message.startsWith(commandManager.prefix)) {
        commandManager.run(data)
        data.cancel = true;
        return;
    }
    system.run(()=> {
        if (data.message.startsWith("-")) return;
        if (data.message.startsWith("!")) return;
        
        const chatMsg = data.message;
    
        const request = new HttpRequest(`${webhookURL}`);
    
        request.method = HttpRequestMethod.Post;
    
        request.body = JSON.stringify({
            embeds: [
                {
                  "title": `${data.sender.name}`,
                  "description": `${data.message}`,
                  "color": 3093093
                }
              ],
        });
    
        request.headers = [
            new HttpHeader("Content-Type", "application/json")
        ];
    
        http.request(request).then((response) => {
            response.body;
        });
    }) 
});
