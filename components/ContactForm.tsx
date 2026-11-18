'use client'

import { useState } from 'react'

interface ContactFormProps {
  email?: string
  mailSubject: string
  labels: {
    name: string
    phone: string
    email: string
    message: string
    submit: string
  }
  bodyLabels: {
    name: string
    phone: string
    email: string
    message: string
  }
}

// Mailler bu adrese düşer (+ _cc ile ikinci adrese). Ücretsiz, hesap gerekmez.
const PRIMARY_RECIPIENT = 'info@fikrimvaricmimarlik.com'
const CC_RECIPIENT = 'info@hauzart.com'
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${PRIMARY_RECIPIENT}`

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm({ mailSubject, labels, bodyLabels }: ContactFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const isTr = bodyLabels.name === 'Ad Soyad'
  const successText = isTr
    ? 'Mesajınız gönderildi, teşekkür ederiz. En kısa sürede size dönüş yapacağız.'
    : 'Your message has been sent. Thank you, we will get back to you shortly.'
  const errorText = isTr
    ? 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya doğrudan e-posta ile ulaşın.'
    : 'Could not send the message. Please try again later or contact us directly by email.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honey) return // honeypot: bot doldurduysa gönderme
    setStatus('sending')

    const payload = {
      _subject: mailSubject,
      _template: 'table',
      _captcha: 'false',
      _cc: CC_RECIPIENT,
      name,
      email: senderEmail,
      [bodyLabels.phone]: phone,
      [bodyLabels.message]: message,
    }

    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success === true || data.success === 'true') {
        setStatus('success')
        setName('')
        setPhone('')
        setSenderEmail('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form-success" role="status">
        <p>{successText}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={labels.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder={labels.phone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="email"
        placeholder={labels.email}
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        required
      />
      <textarea
        placeholder={labels.message}
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {/* Honeypot - gizli, sadece botlar doldurur */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        aria-hidden="true"
      />
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? (isTr ? 'Gönderiliyor…' : 'Sending…') : labels.submit}
      </button>
      {status === 'error' && (
        <p className="contact-form-error" role="alert" style={{ color: '#b91c1c', marginTop: 12 }}>
          {errorText}
        </p>
      )}
    </form>
  )
}
