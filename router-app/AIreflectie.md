# AI Reflectie — Gebruik van Claude tijdens Integration 4

## Van React + Vite naar React Router

We started this project using a standard React/Vite setup. At first, this seemed like a logical choice: it allowed us to get started quickly, provided a familiar environment, and involved very little overhead. We invested a considerable amount of time into this setup, building pages, creating components, and implementing styling.
However, during a development consultation, it became clear that we had unintentionally made things more difficult for ourselves. Since we were working with a Supabase database and wanted to integrate server-side logic, React Router (v7, using Framework Mode) was a much more suitable choice. React Router provides built-in support for features such as clientLoader, clientAction, and file-based routing, making database integration significantly easier.
The challenge was that, by that point, we already had a fully developed React/Vite project. Performing the migration manually—restructuring all routes, updating imports, setting up the router-app architecture with the correct folder structure, configuring routes.ts, and adapting all components to comply with the new conventions—would have required a substantial amount of time and carried a high risk of introducing errors.
Following our lecturer's recommendation, we decided to use Claude (Anthropic) to assist with and accelerate the migration process.

### What Claude did

Claude analysed the existing codebase and carried out the migration step by step:

- Converted the project structure to the `router-app` layout expected by React Router v7
- Rebuilt all pages as route files under `app/routes/`
- Configured file-based routing via `routes.ts` and `root.tsx`
- Added `clientLoader` and `clientAction` functions to routes that fetch or submit data
- Connected the Supabase integration (`supabase.ts` and `supabase.server.ts`) correctly to the new structure
- Migrated components such as `Nav`, `Footer`, `PhotoDropzone` and `Beer`, adapting them where necessary

What would normally have taken several days of work — with a high risk of breaking existing functionality — was reduced to a manageable process. We were able to review Claude's output, make adjustments where needed, and continue building on a stable foundation.

### Reflection

Using AI for this migration was a deliberate and considered decision, not a shortcut. We understood what needed to be done and why, but the time investment required to do it entirely by hand did not outweigh the benefits. Claude acted as an efficient assistant that understood the structure and took on the heavy lifting, while we retained ownership of the key decisions and quality control.


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

During this project I switched fairly quickly to Claude AI as my main tool. At the start I was still using Copilot for smaller things, but for the bigger steps in the project, like the transition to React Router, I needed something that could provide more context and think more deeply alongside me.

I used Claude across many different areas. It helped me with migrating our authentication system to Supabase Auth, since storing passwords in plaintext was obviously not an option. That was a fairly large change that touched multiple files at once. Claude was also a big help when setting up Row Level Security on our Supabase tables and resolving the 403 errors that came up afterwards. Things like correctly configuring policies and granting the right permissions to roles would have taken me much longer to figure out on my own. When our Netlify credits ran out we had to switch to Vercel quickly, and that went surprisingly smoothly with Claude. It knew exactly which configuration files were needed and what had to change in the Vite config.
One thing you do notice is that when a conversation gets too long, the context starts to slip and the responses become less accurate. In that case it's better to start a new chat.

All in all, Claude has significantly sped up my workflow, especially for tasks that require many small precise steps or where I wasn't sure how something worked technically.


----

### Naomi Desmet

I first used AI when I started working on the storytelling page with Elisa. We had already bought Claude AI at that time, and we used it to set up the basic structure for a horizontal scroll experience. That gave us a very good starting point to build on, and definitely saved us a lot of time (which we didn’t have a lot of 😅)

I also used Claude AI to help create a loading animation where two images had to switch back and forth continuously. It provided a basic version that I could then easily adjust and improve.

Besides that, I used Claude AI whenever I got stuck on CSS problems, like when I couldn’t get the positioning of an element right after trying for a long time.

I always made sure I understood the code the AI gave me, so I could still work with it properly and know where to change things if needed.


----

Thank you Claude <3