function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

function updateCountdown() {
    const targetDate = new Date("September 15, 2026 23:59:59").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? '0' + days : days;
        document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

function openModal() {
    document.getElementById('posterModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('posterModal').classList.add('hidden');
}


// ================================
// Multi-Step Form Logic
// ================================

let currentStep = 1;
const totalSteps = 6;

const stepTitles = {
    1: {
        title: "Step 1: Team Leader Details",
        subtitle: "Provide team leader and team name details."
    },
    2: {
        title: "Step 2: First Team Member Registration",
        subtitle: "Provide details for the first team member."
    },
    3: {
        title: "Step 3: Second Team Member Registration",
        subtitle: "Provide details for the second team member."
    },
    4: {
        title: "Step 4: Third Team Member Registration",
        subtitle: "Provide details for the third team member."
    },
    5: {
        title: "Step 5: Fourth Team Member Registration",
        subtitle: "Provide details for the fourth team member."
    },
    6: {
        title: "Step 6: Fifth Team Member Registration",
        subtitle: "Provide details for the fifth team member."
    }
};


function changeStep(direction) {
    const currentStepEl =
        document.querySelector(`.form-step[data-step="${currentStep}"]`);

    // Simple validation check before going forward
    if (direction === 1) {
        const inputs = currentStepEl.querySelectorAll('input, select');

        for (let input of inputs) {
            if (input.hasAttribute('required') && !input.value) {
                input.reportValidity();
                return;
            }
        }
    }

    currentStep += direction;

    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.add('hidden');
    });

    // Show target step
    document
        .querySelector(`.form-step[data-step="${currentStep}"]`)
        .classList.remove('hidden');

    // Update Header Information
    document.getElementById('formStepTitle').innerText =
        stepTitles[currentStep].title;

    document.getElementById('formStepSubtitle').innerText =
        stepTitles[currentStep].subtitle;

    document.getElementById('stepBadge').innerText =
        `Step ${currentStep} of ${totalSteps}`;

    // Toggle Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (currentStep === 1) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    // Scroll slightly to the form top smoothly
    document
        .getElementById('register')
        .scrollIntoView({ behavior: 'smooth' });
}


// ================================
// Final Form Submit
// ================================

function handleFinalSubmit(e) {
    e.preventDefault();

    // Validate last step (Step 6) inputs before submission
    const currentStepEl =
        document.querySelector(`.form-step[data-step="${currentStep}"]`);

    const inputs = currentStepEl.querySelectorAll('input, select');

    for (let input of inputs) {
        if (input.hasAttribute('required') && !input.value) {
            input.reportValidity();
            return;
        }
    }

    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    // Collect all form data using FormData API
    const formElement = document.getElementById('multiStepForm');
    const formData = new FormData(formElement);
    const dataObject = Object.fromEntries(formData.entries());


    // ================================
    // Send data to MongoDB API
    // ================================

    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObject)
    })

    .then(response => response.json())

    .then(data => {

        setTimeout(() => {

            submitBtn.classList.add('hidden');
            document.getElementById('prevBtn').classList.add('hidden');


            // ================================
            // SUCCESS
            // ================================

            if (data.success) {

                feedback.innerHTML = `
                    <div class="success-content">

                        <h2>🎉 Congratulations!</h2>

                        <p>
                            Team registered successfully!
                        </p>

                        <a
                            href="https://chat.whatsapp.com/Hc1orvrPGsGD2Cvmv3kZBV"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="whatsapp-btn"
                        >
                            💬 Join WhatsApp Group
                        </a>

                    </div>
                `;

                feedback.classList.remove('hidden');


                // Hide form after successful registration
                setTimeout(() => {

                    const formContainer =
                        document.querySelector('.form-step').closest('form') ||
                        document.getElementById('multiStepForm');

                    if (formContainer) {
                        formContainer.style.display = 'none';
                    }

                }, 5000);

            }
            // REGISTRATION ERROR

            else {

                feedback.innerText = '❌ ' + data.message;

                feedback.classList.remove(
                    'hidden',
                    'bg-green-500/20',
                    'border-green-500/40',
                    'text-green-300'
                );

                feedback.classList.add(
                    'bg-red-500/20',
                    'border-red-500/40',
                    'text-red-300'
                );

                submitBtn.innerText = 'Submit Form ✓';
                submitBtn.disabled = false;
            }

        }, 800);

    })

    .catch(error => {

        console.error('Error:', error);

        setTimeout(() => {

            submitBtn.innerText = 'Submit Form ✓';
            submitBtn.disabled = false;

            alert('Server connection failed!');

        }, 800);

    });
}