// Shared post list for blog.html and the homepage "From the Blog" strip.
// Add a new post here once and it appears in both places automatically.
// Order = display order (newest first).
const POSTS = [
  { href: 'posts/daring-greatly.html',   category: 'Character Work', title: "Daring Greatly on Stage: A Blueprint for Vulnerable Performance",   excerpt: "Technique and vulnerability are not opposing forces. Drawing on Brené Brown and Stanislavski, a framework for building the courage to risk emotional exposure and shed the armor we carry into the room.",   homeExcerpt: "A five-step framework for risking real emotional exposure on stage, built from Brené Brown's work on shame and vulnerability.", image: 'images/blog/Daring%20Greatly%20on%20Stage/Spring%20Awakening.jpg', imageAlt: 'Performer on stage at SOPAC', date: 'Jul 2026' },
  {
    href: 'posts/singing-actor.html',
    category: 'Character Work',
    title: "Preparing “It’s Hard to Speak My Heart”: A Framework for the Singing Actor",
    excerpt: "Eye focus must be planned with the same rigor as breath management or vowel modification. A director’s approach to one audition piece.",
    homeExcerpt: "Breaking down one audition cut beat by beat, action verbs, physical gesture, and eye focus, built into a repeatable system.",
    image: 'images/blog/First-Day-of-Court.jpg',
    imageAlt: 'Leo Frank Trial, Fulton County Courtroom, Atlanta 1913',
    date: 'Apr 2026'
  },
  { href: 'posts/amelie-vulnerability.html',  category: 'Character Work', title: 'Amélie: Navigating Neglect and Risking Vulnerability',   excerpt: "How Amélie’s character arc moves from the self-protective habits of childhood neglect toward the risk of genuine connection — and what that means for the actor and director.",   homeExcerpt: "How Amélie's arc moves from the self-protective habits of childhood neglect toward real connection, and what that asks of the actor.", date: 'Jul 2022' },
  { href: 'posts/amelie-scenic.html',          category: 'Dramaturgy',    title: 'Amélie: Guimard, Art Nouveau, and the Scenic Aesthetic',   excerpt: "Hector Guimard’s Paris — its cast-iron entrances, riveted ornamentation, and democratic beauty — as the visual foundation for staging Amélie.",   date: 'Apr 2022' },
  { href: 'posts/amelie-color.html',           category: 'Dramaturgy',    title: "Amélie: La couleur de l'étrangeté",   excerpt: "Color in Jeunet's film is not atmospheric decoration — it's structural narrative. An analysis of how red, green, yellow, and blue carry emotional and dramatic weight.",   date: 'Mar 2022' },
  { href: 'posts/zaza-psychology.html',        category: 'Character Work', title: 'Psychological Themes of Zazà',   excerpt: "Addiction, attachment, and the psychology of infidelity — the psychological architecture underlying Leoncavallo’s opera and what it asks of the performers who inhabit it.",   homeExcerpt: "Addiction, attachment, and trauma bonding: the psychological forces underlying Leoncavallo's opera.", date: 'Mar 2022' },
  { href: 'posts/zaza-visual.html',            category: 'Dramaturgy',    title: 'The Visual Language of Zazà',    excerpt: 'Two pioneers of commercial art — Alphonse Mucha and J.C. Leyendecker — and how fin-de-siècle illustration shapes the visual world of this production.',   homeExcerpt: "Mucha and Leyendecker: how fin-de-siècle illustration shapes the visual world of this production.", date: 'Dec 2021' },
  { href: 'posts/zaza-leoncavallo.html',       category: 'Dramaturgy',    title: 'Leoncavallo, Zazà & The Giovane Scuola',   excerpt: 'A biographical and historical introduction to Ruggiero Leoncavallo — the man behind Pagliacci, the rivalry with Puccini, and the opera that closed his most productive decade.',   date: 'Dec 2021' },
  { href: 'posts/mahagonny-medium.html',       category: 'Character Work', title: 'Mahagonny & Medium: The Search for Meaning',   excerpt: 'Two operas, one directing season: how grief, belonging, and the courage to drop our armor connect Weill/Brecht and Menotti across seventy years.',   homeExcerpt: "How grief, belonging, and the courage to drop our armor connect Weill/Brecht and Menotti across seventy years.", date: 'Sep 2021' },
  { href: 'posts/medium-spiritualism.html',    category: 'Dramaturgy',    title: 'The Medium: A History of Spiritualism',   excerpt: "The historical origins of American Spiritualism — and what Menotti’s opera illuminates about grief, belief, and the need to communicate beyond death.",   homeExcerpt: "The origins of American Spiritualism and what Menotti's opera illuminates about grief and belief.", date: 'Sep 2021' },
  { href: 'posts/mahagonny-concept.html',      category: 'Dramaturgy',    title: 'Mahagonny Songspiel — A Concept',   excerpt: "A production concept document for Kurt Weill and Bertolt Brecht’s Mahagonny Songspiel: nihilism, hedonism, grief, and the Weimar Berlin that made all of it possible.",   date: 'Aug 2021' },
];
