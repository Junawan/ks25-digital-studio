export function beep(
    duration=100,
    frequency=900
){

    const ctx =
        new AudioContext();

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.frequency.value=
        frequency;

    oscillator.connect(gain);

    gain.connect(
        ctx.destination
    );

    oscillator.start();

    setTimeout(()=>{

        oscillator.stop();

        ctx.close();

    },duration);

}