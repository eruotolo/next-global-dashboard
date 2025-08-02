import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    userName: string;
    temporaryPassword: string;
    resetBy?: string;
}

export default function ResetPasswordEmail({
    userName,
    temporaryPassword,
    resetBy = 'Administrador',
}: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Tu contraseña ha sido reseteada - Chubby Dashboard</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={h1}>🔐 Chubby Dashboard</Heading>
                    </Section>
                    
                    <Section style={section}>
                        <Heading style={h2}>Contraseña Reseteada</Heading>
                        <Text style={text}>
                            Hola <strong>{userName}</strong>,
                        </Text>
                        <Text style={text}>
                            Tu contraseña ha sido reseteada por un {resetBy}. 
                            Hemos generado una nueva contraseña temporal para tu cuenta:
                        </Text>
                        
                        <Section style={passwordSection}>
                            <Text style={passwordText}>
                                {temporaryPassword}
                            </Text>
                        </Section>
                        
                        <Section style={warningSection}>
                            <Text style={warningTitle}>⚠️ Importante:</Text>
                            <Text style={warningText}>
                                • Esta contraseña es temporal y debe cambiarse después del primer inicio de sesión
                            </Text>
                            <Text style={warningText}>
                                • Por seguridad, no compartas esta contraseña con nadie
                            </Text>
                            <Text style={warningText}>
                                • Si no solicitaste este cambio, contacta inmediatamente al administrador
                            </Text>
                        </Section>
                        
                        <Section style={buttonSection}>
                            <Button style={button} href={process.env.NEXTAUTH_URL || '#'}>
                                Iniciar Sesión
                            </Button>
                        </Section>
                        
                        <Text style={footer}>
                            Saludos,<br />
                            <strong>Equipo Chubby Dashboard</strong>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Estilos
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const section = {
    padding: '0 48px',
};

const logoSection = {
    padding: '32px 48px 0',
    textAlign: 'center' as const,
};

const h1 = {
    color: '#1f2937',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 30px',
    textAlign: 'center' as const,
};

const h2 = {
    color: '#2563eb',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 20px',
};

const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px',
};

const passwordSection = {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const passwordText = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    letterSpacing: '2px',
    margin: '0',
};

const warningSection = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    border: '1px solid #f59e0b',
};

const warningTitle = {
    color: '#92400e',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const warningText = {
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
};

const footer = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '32px 0 0',
};