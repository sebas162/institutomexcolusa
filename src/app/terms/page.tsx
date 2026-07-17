
'use client';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';

function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) =>
    part.startsWith('http') ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function TermsPage() {
  const { language } = useLanguage();
  const t = translations[language].terms;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8 prose prose-lg max-w-none">
          {/* 1. Course Scheduling */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.courseScheduling.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseScheduling.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseScheduling.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseScheduling.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseScheduling.p4)}</p>
            </div>
          </section>

          {/* 2. Course Fees */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.courseFees.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseFees.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseFees.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseFees.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseFees.p4)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.courseFees.p5)}</p>
            </div>
          </section>

          {/* 3. Refund Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.refundPolicy.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.refundPolicy.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.refundPolicy.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.refundPolicy.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.refundPolicy.p4)}</p>
            </div>
          </section>

          {/* 4. Gifts */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.gifts.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.gifts.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.gifts.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.gifts.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.gifts.p4)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.gifts.p5)}</p>
            </div>
          </section>

          {/* 5. Certificates */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.certificates.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.certificates.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.certificates.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.certificates.p3)}</p>
            </div>
          </section>

          {/* 6. Certification Validity */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.certificationValidity.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.certificationValidity.content)}</p>
          </section>

          {/* 7. International Students */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.internationalStudents.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.internationalStudents.content)}</p>
          </section>

          {/* 8. Student Conduct */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.studentConduct.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.studentConduct.p1)}</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              {t.studentConduct.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 9. Congresses and Events */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.congressesEvents.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.congressesEvents.content)}</p>
          </section>

          {/* 10. Support Material */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.supportMaterial.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.supportMaterial.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.supportMaterial.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.supportMaterial.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.supportMaterial.p4)}</p>
            </div>
          </section>

          {/* 11. Products, Laboratories & Professional Responsibility */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.productsLaboratories.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p4)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p5)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.productsLaboratories.p6)}</p>
            </div>
          </section>

          {/* 12. Medical Liability Limitation */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.medicalLiabilityLimitation.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.medicalLiabilityLimitation.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.medicalLiabilityLimitation.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.medicalLiabilityLimitation.p3)}</p>
            </div>
          </section>

          {/* 13. Clinical Results */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.clinicalResults.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.clinicalResults.content)}</p>
          </section>

          {/* 14. Adverse Reactions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.adverseReactions.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.adverseReactions.content)}</p>
          </section>

          {/* 15. Image Usage */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.imageUsage.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.imageUsage.content)}</p>
          </section>

          {/* 16. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.intellectualProperty.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.intellectualProperty.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.intellectualProperty.p2)}</p>
            </div>
          </section>

          {/* 17. Recording Prohibition */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.recordingProhibition.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.recordingProhibition.content)}</p>
          </section>

          {/* 18. Electronic Acceptance */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.electronicAcceptance.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.electronicAcceptance.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.electronicAcceptance.p2)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.electronicAcceptance.p3)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.electronicAcceptance.p4)}</p>
            </div>
          </section>

          {/* 19. Jurisdiction */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.jurisdiction.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.jurisdiction.content)}</p>
          </section>

          {/* 20. Modifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.modifications.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.modifications.content)}</p>
          </section>

          {/* 21. Acceptance */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.acceptance.title}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.acceptance.p1)}</p>
              <p className="text-muted-foreground leading-relaxed">{renderWithLinks(t.acceptance.p2)}</p>
            </div>
          </section>

          <hr className="my-8 border-border" />

          {/* Company Name */}
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{t.companyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
