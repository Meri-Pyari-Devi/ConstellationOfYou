// --- 1. CONFIGURATION: Content & Audio ---
// Ensure files like "eyes.mp3", "mind.mp3" etc. are in the SAME folder.
const data = {
    eyes: {
        title: "The Eyes",
        titleClass: "cls-title",
        textClass: "rom-text",
        audioId: "eyes.mp3", // Make sure this file exists
        text: "Deep enough to drown in.\nBright enough to guide me home.\n\nWhen you look at me,\nthe rest of the world just...\ndisappears."
    },
    mind: {
        title: "// The_Mind",
        titleClass: "tech-title",
        textClass: "tech-text",
        audioId: "mind.mp3",
        text: "const herMind = {\n  intelligence: 'Infinite',\n  wit: 'Sharp',\n  chaos: false\n};\n\n// She doesn't just think.\n// She compiles my life into clarity."
    },
    smile: {
        title: "The Smile",
        titleClass: "rom-title",
        textClass: "rom-text",
        audioId: "smile.mp3",
        text: "It starts in the eyes.\nThen, a slight curve.\nThen, sunlight hits the room.\n\nWarning: Highly contagious.\nSide effects: My heart skipping a beat."
    },
    heart: {
        title: "Empathy (n.)",
        titleClass: "cls-title",
        textClass: "rom-text",
        audioId: "heart.mp3",
        text: "1. The ability to feel what others feel.\n\n2. Her.\n\n(See also: The safest place I know.)"
    },
    chaos: {
        title: "Beautiful Chaos",
        titleClass: "rom-title",
        textClass: "rom-text",
        audioId: "chaos.mp3",
        text: "She is not just calm waters.\nShe is the storm that clears the air.\nThe fire that keeps me warm.\nThe beautiful mess I never want to tidy up."
    }
};

// --- 2. GLOBAL VARIABLES ---
let currentAudio = null;
let typeInterval = null;
let particleInterval = null;

// --- 3. CORE FUNCTIONS ---

function enterSite() {
    const landing = document.getElementById('landingPage');
    const main = document.getElementById('mainInterface');
    
    // Unlock Audio Context (Crucial for Mobile)
    const silent = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASCCO7gAAAAA//OEZAAAAAAB9gAAAAA5dAAAAAAAAAAA");
    silent.play().catch((e) => console.log("Audio unlock failed (ok if desktop):", e)); 

    landing.style.opacity = '0';
    setTimeout(() => {
        landing.classList.add('hidden');
        main.classList.remove('hidden');
    }, 1000);
}

function openStar(key) {
    const item = data[key];
    const wrapper = document.getElementById('cardWrapper');
    const contentBox = document.getElementById('dynamicContent');
    const introText = document.getElementById('introText');

    introText.style.opacity = '0';
    wrapper.classList.remove('hidden');
    contentBox.innerHTML = '';
    
    // Create Title
    const h2 = document.createElement('h2');
    h2.textContent = item.title;
    h2.className = item.titleClass;
    
    // Create Paragraph
    const p = document.createElement('p');
    p.className = item.textClass;
    p.classList.add('typing-cursor'); // Add cursor effect
    
    contentBox.appendChild(h2);
    contentBox.appendChild(p);

    // Start Logic
    startTyping(item.text, p);
    playAudio(item.audioId); // FIXED: Using correct property and function
}

function closeCard() {
    const wrapper = document.getElementById('cardWrapper');
    const introText = document.getElementById('introText');
    
    wrapper.classList.add('hidden');
    introText.style.opacity = '1';
    
    stopAudio(); // FIXED: calling the consistent function name
    if (typeInterval) clearInterval(typeInterval);
}

// --- TYPEWRITER EFFECT ---
function startTyping(text, element) {
    if (typeInterval) clearInterval(typeInterval);
    element.textContent = '';
    let i = 0;
    
    typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            element.classList.remove('typing-cursor'); // Remove cursor when done
        }
    }, 50);
}

// --- AUDIO ENGINE (FIXED) ---
function playAudio(filename) {
    stopAudio(); // Stop any currently playing sound first

    if(!filename) return;

    console.log("Attempting to play:", filename); // Debugging aid
    currentAudio = new Audio(filename);
    currentAudio.volume = 0.1; // Start quiet
    
    currentAudio.play().then(() => {
        startParticles();
        // Fade In
        let fade = setInterval(() => {
            if (currentAudio && currentAudio.volume < 0.8) {
                currentAudio.volume = Math.min(1.0, currentAudio.volume + 0.1);
            } else {
                clearInterval(fade);
            }
        }, 200);
    }).catch(e => {
        console.error("Could not play audio. Check file name.", e);
    });
}

function stopAudio() {
    stopParticles();
    if (currentAudio) {
        // Simple fade out could go here, but strict stop is safer to prevent overlap
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

// --- FINAL PROMISE ---
function finishStory() {
    // CHANGE 1: Play the special song
    // This automatically stops the previous star's audio
    playAudio("forever.mp3"); 
    
    const main = document.getElementById('mainInterface');
    const finalPage = document.getElementById('finalPage');
    const finalText = document.getElementById('finalText');
    const stars = document.getElementById('starContainer');

    // Visual Effect
    stars.style.transition = "transform 5s ease-in";
    stars.style.transform = "scale(3) rotate(20deg)";
    
    main.style.opacity = '0';
    
    setTimeout(() => {
        main.classList.add('hidden');
        finalPage.classList.remove('hidden');
        finalPage.style.opacity = '1'; 
        
        const message = "I have explored every star,\nevery corner of this universe,\nand I still haven't found anything\nas beautiful as you.\n\nYou are my favorite yes.\nYou are my forever. ❤️";
        
        // Add cursor class for effect
        finalText.classList.add('typing-cursor');
        startTyping(message, finalText);
    }, 2000);
}

// --- STARS BACKGROUND GENERATOR ---
const starContainer = document.getElementById('starContainer');
for(let i=0; i<150; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 2 + 1; // Slightly larger stars
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    starContainer.appendChild(star);

}
// --- MAGICAL PARTICLE SYSTEM ---
function startParticles() {
    const card = document.querySelector('.glass-card');
    
    // Add breathing glow
    card.classList.add('card-playing');

    // Create a new particle every 400ms
    particleInterval = setInterval(() => {
        const particle = document.createElement('div');
        particle.classList.add('music-particle');
        
        // Randomize icon: Note or Sparkle
        particle.textContent = Math.random() > 0.5 ? '🎵' : '✨';
        
        // Randomize position width-wise on the card
        const randomLeft = Math.random() * 80 + 10; // 10% to 90% width
        particle.style.left = `${randomLeft}%`;
        
        // Randomize size slightly
        particle.style.fontSize = `${Math.random() * 10 + 10}px`;

        // Add to card
        card.appendChild(particle);

        // Clean up DOM after animation finishes (4s)
        setTimeout(() => {
            particle.remove();
        }, 4000);

    }, 400);
}

function stopParticles() {
    const card = document.querySelector('.glass-card');
    if(card) card.classList.remove('card-playing');
    
    if (particleInterval) {
        clearInterval(particleInterval);
        particleInterval = null;
    }
    
    // Remove any remaining particles instantly
    document.querySelectorAll('.music-particle').forEach(p => p.remove());
}

