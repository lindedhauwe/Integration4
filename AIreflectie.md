# AI Reflectie — Gebruik van Claude tijdens Integration 4

## Van React + Vite naar React Router

We zijn dit project gestart met een standaard React/Vite-setup. In het begin leek dit een logische keuze: snel opgestart, vertrouwde omgeving en weinig overhead. We hebben hier geruime tijd in geïnvesteerd — pagina's gebouwd, componenten opgezet, styling uitgewerkt.

Tijdens een development consult werd ons echter duidelijk dat we het onszelf onnodig moeilijk hadden gemaakt. Omdat we werken met een Supabase-database en server-side logica wilden integreren, was React Router (v7, met de framework-modus) een veel betere keuze. React Router biedt ingebouwde ondersteuning voor `clientLoader`, `clientAction` en file-based routing, wat de integratie met een database aanzienlijk vereenvoudigt.

Het probleem: we hadden op dat moment al een heel project in React/Vite staan. De migratie handmatig uitvoeren — alle routes herstructureren, imports aanpassen, de `router-app`-structuur opzetten met de juiste mappenindeling, de `routes.ts` configureren, en alle componenten compatibel maken met de nieuwe conventions — zou enorm veel tijd en risico op fouten met zich meebrengen.

Op advies van onze docent besloten we Claude (Anthropic) in te zetten om deze migratie te begeleiden en te versnellen.

### Wat Claude heeft gedaan

Claude heeft de bestaande codebase geanalyseerd en stap voor stap de migratie uitgevoerd:

- De projectstructuur omgezet naar de `router-app`-opbouw die React Router v7 verwacht
- Alle pagina's opnieuw opgezet als route-bestanden onder `app/routes/`
- De file-based routing geconfigureerd via `routes.ts` en `root.tsx`
- `clientLoader` en `clientAction` functies toegevoegd aan routes die data ophalen of versturen
- Supabase-integratie (`supabase.ts` en `supabase.server.ts`) correct aangesloten op de nieuwe structuur
- Componenten zoals `Nav`, `Footer`, `PhotoDropzone` en `Beer` overgezet en where nodig aangepast

Wat normaal meerdere dagen werk zou zijn geweest — met veel kans op het breken van bestaande functionaliteit — werd hiermee teruggebracht tot een beheersbaar proces. We konden de output van Claude reviewen, bijsturen waar nodig, en verder bouwen op een stabiele basis.

### Reflectie

Het inzetten van AI voor deze migratie was een bewuste en doordachte keuze, geen gemakzucht. We begrepen wat er moest gebeuren en waarom, maar de tijdsinvestering om het volledig manueel te doen woog niet op tegen de meerwaarde. Claude fungeerde hierin als een efficiënte assistent die de structuur kende en het zware werk overnam, terwijl wij de inhoudelijke keuzes en de kwaliteitscontrole in handen hielden.


## Persoonlijke reflecties

### Femke De Latter

Bij het opstellen van de code in React was ik vrij snel door mijn Copilot-tokens heen. Ik gebruikte deze voornamelijk om de basisstructuur van mijn code correct op te zetten. Zodra die basis klaar was, kon ik beginnen met het aanmaken van bestanden, componenten, routes, enzovoort. De basis van HTML en een beperkte hoeveelheid CSS kwamen hierbij al aan bod, maar er was nog geen sprake van uitgebreide vormgeving.

Met Copilot ben ik vervolgens aan de slag gegaan om de eerste JavaScript-functionaliteiten op te zetten. Veel verder geraakten we echter niet voordat we te horen kregen dat het beter zou zijn om over te schakelen naar React Router. Daarom besloten we om Claude AI aan te schaffen om deze overgang vlotter te laten verlopen. Die overstap verliep relatief soepel en binnen enkele uren waren we erin geslaagd om alles correct om te zetten naar React Router.

Sindsdien maken we actief gebruik van Claude AI om efficiënter te werken. Zo gebruik ik het bijvoorbeeld bij het stylen van pagina’s. Door het ontwerp of design te delen met Claude kan het al een goede basis genereren met de nodige stijlelementen, waarop vervolgens eenvoudig verder gebouwd kan worden met eigen CSS. Ook bij het gebruik van Supabase en Cloudinary bleek het een handige tool, aangezien het vaak al inzicht heeft in de aanbevolen werkwijze en implementatie.

Daarnaast gebruik ik Claude AI vooral voor snelle en efficiënte taken, zoals het oplossen van foutmeldingen, het genereren van basisfunctionaliteiten en het versnellen van repetitieve ontwikkeltaken.


----

### Elisa Wastyn

At the beginning of my personal coding work, I mainly relied on the Copilot integration in VS Code. I first used it while developing the beer-drinking test with a smartphone. However, because the available credits in VS Code had recently been reduced, they were used up quickly. At that stage, I mostly depended on Copilot to build a basic foundation for the project and to solve problems that I could not easily find answers to myself.

Since I was still struggling with certain aspects of the concept, I felt that I could really benefit from additional support to speed up the development process. That is why I started using my brother’s Claude AI account. I found it to be much more effective than Copilot. I could ask well-structured questions and receive detailed answers that showed a clear reasoning process. I was genuinely impressed by how thoroughly the AI considered different aspects and how transparently it explained its approach. This made it easy for me to review what had been done and understand the code well enough to make adjustments and improvements myself.

Later on, when I became more involved in coding again, our group had already subscribed to Claude for this integration project. It continued to be very useful for speeding up workflows and solving problems. For example, by writing a long but clear prompt, we were able to generate a solid foundation for the scrollytelling component. Throughout the process, I always carefully reviewed any changes before committing them, ensuring that no unexpected modifications were introduced and that I remained actively involved in understanding the code.

Overall, working with AI made the coding process much smoother. The only noticeable limitation was when a conversation became too large and contained too much context, which sometimes reduced the quality of the responses and consumed more credits. Nevertheless, I have to admit that if tools like Claude AI were freely available, they could make software development processes significantly faster and more efficient for me.

----

### Linde D'Hauwe


----

### Naomi Desmet