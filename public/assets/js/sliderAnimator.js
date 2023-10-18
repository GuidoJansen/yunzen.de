import {createAnimator} from '/assets/js/modules/yubooAnimator.js';

{
    const animatorBerufserfahrung = createAnimator(document.getElementById('stage-berufserfahrung'), {auto: false})
    const animatorAusbildung = createAnimator(document.getElementById('stage-ausbildung'), {auto: false})
    const animatorExpertise = createAnimator(document.getElementById('stage-expertise'), {auto: false})
    const animatorReferenzen = createAnimator(document.getElementById('stage-referenzen'), {auto: false})

    document.addEventListener('click', (e) => {
        let go;
        go = e.target.closest('.berufserfahrung [data-actor-number]');
        if (go) {
            activate(go, animatorBerufserfahrung)
            return;
        }
        go = e.target.closest('.ausbildung [data-actor-number]');
        if (go) {
            activate(go, animatorAusbildung)
            return;
        }
        go = e.target.closest('.expertise [data-actor-number]');
        if (go) {
            activate(go, animatorExpertise)
            return;
        }
        go = e.target.closest('.referenzen [data-actor-number]');
        if (go) {
            switch(go.dataset.actorNumber) {
                case 'prev':
                    animatorReferenzen.prev();
                    break;
                case 'next':
                    animatorReferenzen.next();
                    break;
            }
            return;
        }
    })

    const activate = (go, animator) => {
        animator.go(parseInt(go.dataset.actorNumber))
        Array.from(go.parentElement.querySelectorAll('[data-actor-number]')).forEach(el => el.classList.remove('active'))
        go.classList.add('active')
    }
}
