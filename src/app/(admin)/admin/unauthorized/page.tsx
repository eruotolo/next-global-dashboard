import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="rounded-xl bg-muted/50 aspect-video">
            <div className="flex flex-col justify-center items-center h-[85vh]">
                <h1 className="mb-4 text-3xl font-bold text-red-600">Acceso denegado</h1>
                <p className="mb-6 text-gray-700">
                    Lo sentimos, pero no tienes permiso para ver esta página.
                </p>
                <Link
                    href="/admin/dashboard"
                    className="font-inter h-[36px] px-[20px] mt-[20px] rounded-[10px] border-0 bg-gray-600 text-[13px] font-normal text-white hover:bg-gray-300 hover:text-white  disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                    Regresar al Dashboard
                </Link>
            </div>
        </div>
    );
}
