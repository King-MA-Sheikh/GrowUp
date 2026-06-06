import Hero from '../components/Hero';
import Services from '../components/Services';
import Stats from '../components/Stats';
import TechStack from '../components/TechStack';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjects, getTeamMembers, getTechnologies } from '../utils/api';

// Additional Components for Home Page
function ForClientsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects({ page_size: 6, featured: true });
      setProjects(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">For Clients</span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Build Your <span className="gradient-text">Dream Project</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From concept to deployment, we bring your ideas to life with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Share Your Idea</h3>
            <p className="text-slate-400 text-sm">Tell us your vision and we'll help you shape it</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-deep-purple flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Get Expert Development</h3>
            <p className="text-slate-400 text-sm">Our experts build your project with best practices</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-deep-purple to-electric-blue flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Launch & Grow</h3>
            <p className="text-slate-400 text-sm">Deploy your project and watch your business grow</p>
          </div>
        </div>

        {!loading && projects.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-sora font-semibold text-white text-center mb-6">Featured Projects</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map(project => (
                <Link key={project.id} to={`/portfolio/${project.slug}`} className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-sora font-bold text-white">{project.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.short_description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Start Your Project <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ForEmployeesSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">For Professionals</span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Join Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Work remotely, grow professionally, and build amazing products with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">100% Remote</h3>
            <p className="text-slate-400 text-sm">Work from anywhere in the world</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Career Growth</h3>
            <p className="text-slate-400 text-sm">Learn and grow with mentorship programs</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Cutting-edge Tech</h3>
            <p className="text-slate-400 text-sm">Work with the latest technologies</p>
          </div>
        </div>

        {!loading && jobs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-sora font-semibold text-white text-center mb-6">Open Positions</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobs.slice(0, 5).map(job => (
                <Link key={job.id} to={`/careers/${job.slug}`} className="glass-card rounded-xl p-4 flex justify-between items-center hover:bg-dark-card/50 transition-all">
                  <div>
                    <h4 className="font-sora font-semibold text-white">{job.title}</h4>
                    <p className="text-slate-400 text-xs">{job.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-neon-green/20 text-neon-green">{job.employment_type_display}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
            View All Jobs <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ForStudentsSection() {
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const res = await getTechnologies({ page_size: 20 });
      setTechnologies(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching technologies:', err);
    }
  };

  return (
    <section className="py-20 bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">For Students & Learners</span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Learn <span className="gradient-text">Modern Tech</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get hands-on experience with industry-standard technologies and build your portfolio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Learn by Doing</h3>
            <p className="text-slate-400 text-sm">Project-based learning with real-world applications</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Mentorship</h3>
            <p className="text-slate-400 text-sm">Get guidance from industry experts</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Career Support</h3>
            <p className="text-slate-400 text-sm">Job placement assistance and interview prep</p>
          </div>
        </div>

        {technologies.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-sora font-semibold text-white text-center mb-6">Technologies You'll Learn</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {technologies.slice(0, 12).map(tech => (
                <span key={tech.id} className="px-3 py-1.5 rounded-full bg-dark-card border border-dark-border text-sm text-slate-300">
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Start Learning <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ForTeachersSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag">For Educators</span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Empower Your <span className="gradient-text">Students</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Bring industry-relevant curriculum and real-world projects to your classroom
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Ready-made Curriculum</h3>
            <p className="text-slate-400 text-sm">Industry-aligned course materials and projects</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Industry Partnerships</h3>
            <p className="text-slate-400 text-sm">Connect students with real-world opportunities</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-sora font-bold text-white text-lg mb-2">Assessment Tools</h3>
            <p className="text-slate-400 text-sm">Track student progress and outcomes</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 mt-12 text-center bg-gradient-to-br from-electric-blue/10 to-neon-cyan/10">
          <h3 className="text-2xl font-sora font-bold text-white mb-4">Partner With Us</h3>
          <p className="text-slate-400 mb-6">Join our academic partnership program</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Become a Partner <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Stats />
      
      {/* Role-based sections */}
      <ForClientsSection />
      <ForEmployeesSection />
      <ForStudentsSection />
      <ForTeachersSection />
      
      <TechStack />
      <Testimonials />
      <Contact />
    </>
  );
}