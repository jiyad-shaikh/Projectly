import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import "./ParticlesBackground.scss";

const particlesInit = async (engine) => {
  await loadSlim(engine);
};

function ParticlesBackground() {
  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false
      },

      fpsLimit: 60,

      particles: {
        number: {
          value: 60,
          density: {
            enable: true
          }
        },

        color: {
          value: ["#7c3aed", "#4f46e5", "#2563eb", "#06b6d4"]
        },

        links: {
          enable: true,
          distance: 135,
          color: "#7c3aed",
          opacity: 0.08,
          width: 1
        },

        move: {
          enable: true,
          speed: 0.65,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out"
          }
        },

        opacity: {
          value: {
            min: 0.35,
            max: 0.75
          }
        },

        size: {
          value: {
            min: 1.2,
            max: 2.5
          }
        },

        shape: {
          type: "circle"
        }
      },

      interactivity: {
        detectsOn: "window",

        events: {
          onHover: {
            enable: true,
            mode: "grab"
          },

          resize: {
            enable: true
          }
        },

        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.18
            }
          }
        }
      },

      detectRetina: true
    }),
    []
  );

  return (
    <div className="particles-background">
      <ParticlesProvider init={particlesInit}>
        <Particles
          id="projectly-particles"
          options={options}
        />
      </ParticlesProvider>
    </div>
  );
}

export default ParticlesBackground;

