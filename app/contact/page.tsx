import type { Metadata } from 'next';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import s from './contact.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Contact' };

export default function ContactPage() {
  return (
    <div className={`page ${s.root}`} data-page="contact">
      <ContactHero />
      <ContactForm />
    </div>
  );
}
