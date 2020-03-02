pragma solidity ^0.4.18;

contract GestorNotas {
    
    uint notasdelamateria;
    uint[] arreglo;
    uint[] ArregloTotal;
    uint[] HistorialNotasParticulares;
    uint[] HisotialMateria;
    struct CrearNota {
        uint porcentaje;    // Valor del porcentaje
        string Nombre;      // Nombre de la materia
        string IdMateria;   //Id de la materia donde irá la nota
        bool EstadoNota;    // Si la nota se encuentra activa o inactiva
        string fecha;
    }
        uint CrearNotasIDS=0;
        mapping (uint => CrearNota) CrearNotas;
    
    struct CrearNotaHistorial {
        uint porcentaje;    // Valor del porcentaje
        string Nombre;      // Nombre de la materia
        string IdMateria;   //Id de la materia del historial
        bool EstadoNota;    // Si la nota se encuentra activa o inactiva
        string fecha;
    }
        uint CrearNotasHistorialIDS=0;
        mapping (uint => CrearNotaHistorial) CrearNotasHistorial;
    
    struct NotaEstudiante{
        uint ValorNota;           //Valor de Nota
        uint IdMateria;            //asocia esta nota del estudiante a una nota particular
        string IdEstudiante; //Id del estudiante que tiene la nota
        string fecha;
        
    }
        uint CrearNotasEstudianteIDS=0;
        mapping (uint => NotaEstudiante) NotaEstudiantes;
    
    struct NotaEstudianteHistorial{
        uint ValorNota;           //Valor de Nota
        uint IdMateria;            //asocia esta nota del estudiante a una nota particular
        string IdEstudiante; //Id del estudiante que tiene la nota
        string fecha;
    }
     uint CrearNotasEstudianteHistorialIDS=0;
    mapping (uint => NotaEstudianteHistorial) NotaEstudiantesHistorial;
    //Por acuerdo este será el sistema:
    // Materia: Una Materia como furier o ondas 
    // NotaGeneral : es una nota de la Materia
    //Nota particular : es una nota de un estudiante
    
    function GetNumeroDeNotasGenerales() view public returns (uint Notas){
        Notas = CrearNotasIDS;
        return Notas;
    }
    function GetNumeroDeNotasGeneralesActivas() view public returns (uint Notas){
        uint a = 0;
        for (uint i=0; i<=CrearNotasIDS; i++){
            if(CrearNotas[i].EstadoNota==true){
                    a++;
            }
                
        }
        
        return a;
    }
    function GetNotaGeneral(uint NumeroDeNotaGeneral) view public returns (uint, string, string, bool, string ){
        return (
            CrearNotas[NumeroDeNotaGeneral].porcentaje, 
            CrearNotas[NumeroDeNotaGeneral].Nombre,
            CrearNotas[NumeroDeNotaGeneral].IdMateria,
            CrearNotas[NumeroDeNotaGeneral].EstadoNota,
            CrearNotas[NumeroDeNotaGeneral].fecha
            );
    }
    function GetNotasTotalesMateria(string IdMateriaR) view public returns (uint[] memory) {
        GetsizeNotasGeneralesTotalesMateria(IdMateriaR);
        return ArregloTotal;
    }
    function GetNotasGeneralesMateria(string IdMateriaR) view public returns (uint[] memory) {
        GetsizeNotasMateria(IdMateriaR);
        return arreglo;
    }
    function GetsizeNotasGeneralesTotalesMateria(string IdMateriaR) private returns (uint) {
        string IdMateriaC;
        uint a = 0;
        for (uint i=0; i<=CrearNotasIDS; i++){
            IdMateriaC = CrearNotas[i].IdMateria;
                if (keccak256(abi.encodePacked((IdMateriaC))) == keccak256(abi.encodePacked((IdMateriaR)))){
                    a++;
                    ArregloTotal.push(i);
                }
                
        }
        
        return a;
    }    
    function GetsizeNotasMateria(string IdMateriaR) private returns (uint) {
        string IdMateriaC;
        uint a = 0;
        for (uint i=0; i<=CrearNotasIDS; i++){
            IdMateriaC = CrearNotas[i].IdMateria;
            bool IdActiva = CrearNotas[i].EstadoNota;
            if(IdActiva==true){
                if (keccak256(abi.encodePacked((IdMateriaC))) == keccak256(abi.encodePacked((IdMateriaR)))){
                    a++;
                    arreglo.push(i);
                }
            }
                
        }
        
        return a;
    }
    
    function ModificarEstadoNotaGeneral(uint IdNotaGeneral, string memory _fecha) public returns(bool){
        CrearNotas[IdNotaGeneral].EstadoNota = !CrearNotas[IdNotaGeneral].EstadoNota;
        CrearNotas[IdNotaGeneral].fecha=_fecha;
         
        var NewNotaHistorial = CrearNotasHistorial[CrearNotasHistorialIDS];
        NewNotaHistorial.porcentaje= CrearNotas[IdNotaGeneral].porcentaje;
        NewNotaHistorial.Nombre =CrearNotas[IdNotaGeneral].Nombre;
        NewNotaHistorial.IdMateria = CrearNotas[IdNotaGeneral].IdMateria;
        
        
        NewNotaHistorial.EstadoNota = !CrearNotas[IdNotaGeneral].EstadoNota;
        NewNotaHistorial.fecha = _fecha;
        
        CrearNotasHistorialIDS++;
        return true;

    }
    function ModificarPorcentajeNotaGeneral(uint IdNotaGeneral, uint _porcentaje, string memory _fecha) public returns(bool){
        CrearNotas[IdNotaGeneral].porcentaje = _porcentaje;
        CrearNotas[IdNotaGeneral].fecha = _fecha;
        
        var NewNotaHistorial = CrearNotasHistorial[CrearNotasHistorialIDS];
        NewNotaHistorial.porcentaje= _porcentaje;
        
        NewNotaHistorial.Nombre =CrearNotas[IdNotaGeneral].Nombre;
        NewNotaHistorial.IdMateria = CrearNotas[IdNotaGeneral].IdMateria;
        NewNotaHistorial.EstadoNota = CrearNotas[IdNotaGeneral].EstadoNota;
        NewNotaHistorial.fecha =_fecha;
        
        CrearNotasHistorialIDS++;
        return true;

    }
    function ModificarNombreNotaGeneral(uint IdNotaGeneral, string memory _Nombre, string memory _fecha) public returns(bool){
        CrearNotas[IdNotaGeneral].Nombre = _Nombre;
        CrearNotas[IdNotaGeneral].fecha = _fecha;
        
        var NewNotaHistorial = CrearNotasHistorial[CrearNotasHistorialIDS];
        NewNotaHistorial.porcentaje= CrearNotas[IdNotaGeneral].porcentaje;
        NewNotaHistorial.Nombre =_Nombre;
        
        NewNotaHistorial.IdMateria = CrearNotas[IdNotaGeneral].IdMateria;
        NewNotaHistorial.EstadoNota = CrearNotas[IdNotaGeneral].EstadoNota;
        NewNotaHistorial.fecha = _fecha;
        
        CrearNotasHistorialIDS++;
        return true;

    }
    function ModificarNotaParticular (uint  _ValorNota, uint _IdNotaGeneral, string  _IdEstudiate, string memory _fecha) public {
        (uint id,bool error)=IdentificadorNotaparticular(_IdNotaGeneral,_IdEstudiate);
        if( error==false){
            NotaEstudiantes[id].ValorNota=_ValorNota;
            CrearNotas[id].fecha = _fecha;
            
             var NewNotaEstudianteHistorial = NotaEstudiantesHistorial[CrearNotasEstudianteHistorialIDS];
             NewNotaEstudianteHistorial.ValorNota = _ValorNota;
             NewNotaEstudianteHistorial.IdMateria = NotaEstudiantes[id].IdMateria;
             NewNotaEstudianteHistorial.IdEstudiante = NotaEstudiantes[id].IdEstudiante;
             NewNotaEstudianteHistorial.fecha = _fecha;

            CrearNotasEstudianteHistorialIDS++;
        }else{
            CrearNotaParticular(_ValorNota,_IdNotaGeneral,_IdEstudiate, _fecha);
        }
        
    }

    
    function CrearNotaGeneral( uint _porcentaje, string memory _IdMateria, string memory _Nombre, string memory _fecha) public returns (bool) {

        var NewNota = CrearNotas[CrearNotasIDS];
        NewNota.porcentaje = _porcentaje;
        NewNota.Nombre = _Nombre;
        NewNota.IdMateria = _IdMateria;
        NewNota.EstadoNota = true;
        NewNota.fecha = _fecha;
        CrearNotasIDS++;
        
        var NewNotaHistorial = CrearNotasHistorial[CrearNotasHistorialIDS];
        NewNotaHistorial.porcentaje= _porcentaje;
        NewNotaHistorial.Nombre =_Nombre;
        NewNotaHistorial.IdMateria = _IdMateria;
        NewNotaHistorial.EstadoNota = true;
        NewNotaHistorial.fecha = _fecha;
        CrearNotasHistorialIDS++;
        
        return true;

    }
    
    function CrearNotaParticular (uint  _ValorNota, uint _IdNotaGeneral, string  _IdEstudiate, string memory _fecha) public {

            var NewNotaEstudiante= NotaEstudiantes[CrearNotasEstudianteIDS];
            NewNotaEstudiante.ValorNota=_ValorNota;
            NewNotaEstudiante.IdMateria=_IdNotaGeneral;
            NewNotaEstudiante.IdEstudiante= _IdEstudiate;
            NewNotaEstudiante.fecha = _fecha;
            CrearNotasEstudianteIDS++;
            
            var NewNotaEstudianteHistorial = NotaEstudiantesHistorial[CrearNotasEstudianteHistorialIDS];
             NewNotaEstudianteHistorial.ValorNota = _ValorNota;
             NewNotaEstudianteHistorial.IdMateria = _IdNotaGeneral;
             NewNotaEstudianteHistorial.IdEstudiante = _IdEstudiate;
             NewNotaEstudianteHistorial.fecha = _fecha;
            CrearNotasEstudianteHistorialIDS++;
    }
    function consultarNotaParticular (uint _IdNotaGeneral, string _IdEstudiateConsulta, uint IdNotaIndividual, uint Dummy) view public returns (uint, uint, uint){
        string IdEstudianteRevisado;
        uint MateriaRevisada;
        uint valorNotaDevuelto;
        for (uint i=0; i<=CrearNotasEstudianteIDS; i++){
            IdEstudianteRevisado = NotaEstudiantes[i].IdEstudiante;
            if (keccak256(abi.encodePacked((IdEstudianteRevisado))) == keccak256(abi.encodePacked((_IdEstudiateConsulta)))){
                MateriaRevisada=NotaEstudiantes[i].IdMateria;
                if(MateriaRevisada==_IdNotaGeneral){
                    valorNotaDevuelto=NotaEstudiantes[i].ValorNota;
                    return(valorNotaDevuelto,IdNotaIndividual,Dummy);
                    
                }
            }
        }
        return (123,IdNotaIndividual,Dummy);
    }
    function consultarNotageneralH(uint _IdNotaGeneral)view public returns (uint, string, string, bool, string ){
        return (
            CrearNotasHistorial[_IdNotaGeneral].porcentaje, 
            CrearNotasHistorial[_IdNotaGeneral].Nombre,
            CrearNotasHistorial[_IdNotaGeneral].IdMateria,
            CrearNotasHistorial[_IdNotaGeneral].EstadoNota,
            CrearNotasHistorial[_IdNotaGeneral].fecha
        );
    }
    
    function consultarNotaParticularH(uint _IdNotaparticular)view public returns (uint, uint, string, string ){
        return (
            NotaEstudiantesHistorial[_IdNotaparticular].ValorNota, 
            NotaEstudiantesHistorial[_IdNotaparticular].IdMateria,
            NotaEstudiantesHistorial[_IdNotaparticular].IdEstudiante,
            NotaEstudiantesHistorial[_IdNotaparticular].fecha
        );
    }
    
    function IdentificadorNotaparticular (uint _IdNotaGeneral, string  _IdEstudiate) view public returns(uint,bool){
        uint IdMateriaC;
        string IdEstudianteC;
        uint a = 0;
        for (uint i=0; i<=CrearNotasEstudianteIDS; i++){
            IdMateriaC = NotaEstudiantes[i].IdMateria;
            IdEstudianteC = NotaEstudiantes[i].IdEstudiante;
            if(keccak256(abi.encodePacked((IdMateriaC))) == keccak256(abi.encodePacked((_IdNotaGeneral)))){
                if (keccak256(abi.encodePacked((IdEstudianteC))) == keccak256(abi.encodePacked((_IdEstudiate)))){
                    return (i,false);
                }
            }
                
        }
        
        return (0,true);
    }
    
    function ConsultarHistorialNotas (string _IdEstudiate, string _IdMateria, uint _IdNotaGeneral) returns (uint[], uint[]){
        string IdMateriaC;
        string IdEstudiate;
        
        //retorna el historial de una nota general solo necesita un identificador, _IdMateria
        
        for (uint i=0; i<=CrearNotasHistorialIDS; i++){
        IdMateriaC = CrearNotasHistorial[i].IdMateria;
        if (keccak256(abi.encodePacked((IdMateriaC))) == keccak256(abi.encodePacked((_IdMateria)))){
            HisotialMateria.push(i);
        }
                
        }
        
        // retorna el historial de una nota particular, y _idestudiante
        
        for (uint j=0; j<=CrearNotasEstudianteHistorialIDS; j++){
            IdEstudiate = NotaEstudiantesHistorial[j].IdEstudiante;
            if (keccak256(abi.encodePacked((_IdEstudiate))) == keccak256(abi.encodePacked((IdEstudiate)))){
                HistorialNotasParticulares.push(j);
            }
                
        }
        

        
        return (HistorialNotasParticulares,HisotialMateria);
    }

    

    
}