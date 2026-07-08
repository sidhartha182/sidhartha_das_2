import { useEffect, useRef, useState } from 'react';
import { projects, philosophy, experience, education } from '../data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Overlay() {
  const overlayRef = useRef();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const getAssetUrl = (path) => {
    if (path.startsWith('/')) {
      return `${import.meta.env.BASE_URL}${path.slice(1)}`;
    }
    return path;
  };

  useEffect(() => {
    if (selectedProject) {
      gsap.fromTo('.project-modal-content', 
        { scale: 0.5, opacity: 0, rotationX: 45, y: 100 },
        { scale: 1, opacity: 1, rotationX: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      );
      gsap.fromTo('.project-modal-overlay', 
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(10px)', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [selectedProject]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const progress = document.querySelector('.progress-bar');
      if (progress) {
        // Preloader Animation
        const tl = gsap.timeline({
          onComplete: () => setLoading(false)
        });

        const progressObj = { value: 0 };

        tl.to(progressObj, {
            value: 100,
            duration: 1.5,
            ease: 'power3.inOut',
            onUpdate: () => {
              const perc = document.querySelector('.loading-percentage');
              if (perc) perc.innerHTML = Math.round(progressObj.value) + '%';
            }
          }, 0)
          .to('.progress-bar', { width: '100%', duration: 1.5, ease: 'power3.inOut' }, 0)
          .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
          .from('.hero-title:not(.animate-on-scroll)', { y: 100, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.1 }, "-=0.5")
          .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, ease: 'power4.out' }, "-=0.8");
      }

      // Scroll Animations
      const sections = gsap.utils.toArray('.animate-on-scroll');
      
      sections.forEach((sec) => {
        gsap.fromTo(sec, 
          { opacity: 0, y: 100 },
          {
            opacity: 1, 
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
            }
          }
        );
      });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Preloader */}
      {loading && (
        <div className="preloader">
          <div className="loader-graphics">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
          <div className="preloader-text">INITIALIZING SYSTEM</div>
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
          <div className="loading-percentage">0%</div>
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedProject(null)}>
              <X size={24} color="#fff" />
            </button>
            <div className="modal-header">
              <h2 className="modal-title">{selectedProject.title}</h2>
              <div className="modal-metric" style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', fontFamily: 'Space Grotesk' }}>
                {selectedProject.metric} - {selectedProject.metricSub}
              </div>
            </div>
            <img src={getAssetUrl(selectedProject.image)} alt={selectedProject.title} className="modal-image" />
            <div className="modal-body">
              <p className="modal-desc">{selectedProject.description}</p>
              <div className="tags" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                {selectedProject.tags.map((tag, i) => (
                  <span className="tag" key={i}>{tag}</span>
                ))}
              </div>
              <a href={selectedProject.githubLink || '#'} className="submit-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', background: 'transparent', border: '1px solid var(--accent-cyan)', color: '#fff' }} onClick={(e) => e.preventDefault()}>
                View Source on GitHub
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="overlay" ref={overlayRef}>
        
        <nav className="nav-header">
          <div className="logo">SD_</div>
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
          </button>

          <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
            <a href="#philosophy" onClick={() => setMenuOpen(false)}>Philosophy</a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>Cases</a>
            <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
            <a href="#education" onClick={() => setMenuOpen(false)}>Education</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="section hero" id="home">
          <div>
            <h1 className="hero-title">SIDHARTHA</h1>
          </div>
          <div>
            <h1 className="hero-title">DAS.</h1>
          </div>
          <h2 className="hero-subtitle">Product Manager. Strategist. Builder.</h2>
          <a href={getAssetUrl('/Resume.pdf')} className="submit-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem', pointerEvents: 'auto' }} target="_blank" rel="noreferrer">
            <Download size={20} /> Access Resume
          </a>
        </section>

        {/* Philosophy Section */}
        <section className="section" id="philosophy">
          <div className="massive-text animate-on-scroll">MINDSET</div>
          <h2 className="hero-title animate-on-scroll" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0' }}>The PM Philosophy</h2>
          <div className="philosophy-grid">
            {philosophy.map((phil) => (
              <div className="phil-card animate-on-scroll" key={phil.id}>
                <div className="phil-number">{phil.id}</div>
                <h3 className="phil-title">{phil.title}</h3>
                <p className="phil-desc">{phil.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cinematic Case Studies Section */}
        <section className="section" id="projects" style={{ padding: '8rem 5%' }}>
          <div className="massive-text animate-on-scroll">WORK</div>
          <h2 className="hero-title animate-on-scroll" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0', marginBottom: '8rem', textAlign: 'center' }}>Selected Case Studies</h2>
          
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {projects.map((proj) => (
              <div className="case-study animate-on-scroll" key={proj.id}>
                <div className="cs-image-container">
                  <img src={getAssetUrl(proj.image)} alt={proj.title} className="cs-image" />
                </div>
                <div className="cs-content">
                  <div className="cs-metric">{proj.metric}</div>
                  <div style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'Space Grotesk' }}>{proj.metricSub}</div>
                  <h3 className="cs-title">{proj.title}</h3>
                  <p className="cs-desc">{proj.description}</p>
                  <div className="tags">
                    {proj.tags.map((tag, i) => (
                      <span className="tag" key={i}>{tag}</span>
                    ))}
                  </div>
                  <div className="cs-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button className="submit-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }} onClick={() => setSelectedProject(proj)}>
                      View Details
                    </button>
                    <a href={proj.githubLink || '#'} className="submit-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', background: 'transparent', border: '1px solid var(--accent-cyan)', color: '#fff' }} onClick={(e) => e.preventDefault()}>
                      GitHub Repo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="section" id="experience">
          <div className="massive-text animate-on-scroll">TIMELINE</div>
          <h2 className="hero-title animate-on-scroll" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0', textAlign: 'center' }}>Career Trajectory</h2>
          <div className="timeline animate-on-scroll" style={{ maxWidth: '800px', margin: '4rem auto 0' }}>
            {experience.map((exp) => (
              <div className="timeline-item" key={exp.id}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">{exp.date}</div>
                <h3 className="timeline-title" style={{ fontSize: '1.5rem' }}>{exp.role}</h3>
                <div className="timeline-company" style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>{exp.company}</div>
                <p className="cs-desc" style={{ fontSize: '1.1rem' }}>{exp.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="section" id="education">
          <div className="massive-text animate-on-scroll">ACADEMIA</div>
          <h2 className="hero-title animate-on-scroll" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0', textAlign: 'center' }}>Education Journey</h2>
          <div className="timeline animate-on-scroll" style={{ maxWidth: '800px', margin: '4rem auto 0' }}>
            {education.map((edu) => (
              <div className="timeline-item" key={edu.id}>
                <div className="timeline-dot" style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
                <div className="timeline-date" style={{ color: 'var(--accent-purple)' }}>{edu.date}</div>
                <h3 className="timeline-title" style={{ fontSize: '1.5rem' }}>{edu.degree}</h3>
                <div className="timeline-company" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{edu.institution}</div>
                <p className="cs-desc" style={{ fontSize: '1.1rem' }}>{edu.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="section animate-on-scroll" id="contact" style={{ minHeight: '80vh', alignItems: 'center' }}>
          <h2 className="hero-title" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', textAlign: 'center', marginBottom: '4rem' }}>Initiate Protocol.</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="form-input" placeholder="Name / Designation" />
            <input type="email" className="form-input" placeholder="Secure Email Channel" />
            <textarea className="form-input" placeholder="Transmission Payload..." rows="5"></textarea>
            <button type="submit" className="submit-btn">SEND TRANSMISSION</button>
          </form>
        </section>

      </div>
    </>
  );
}
